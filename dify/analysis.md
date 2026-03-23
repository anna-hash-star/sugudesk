# Dify チャットボット 問題分析と改善案

## 報告された問題

1. **院が正しく呼び出されない**（ルナレディース）
2. **回答にないURLを生成している**（両Bot共通）

---

## 問題1: 院が正しく呼び出されない

### 原因

**院ステータス判定にLLMを使っている**のが根本原因。

現在の流れ:
```
ユーザー入力「横浜駅前院」
  → LLM（gpt-5-mini）が判定
  → {"clinic":"横浜駅前院", "is_selection":true}
```

LLMは単純な文字列一致でも「解釈」してしまうため:
- 「横浜」だけで「横浜駅前院」と判定してしまう
- 「川崎の予約」を院選択と誤判定する
- 逆に「横浜駅前院」と正確に入力しても is_selection=false にする場合がある

さらに `clinic_history` が `string` 型で毎回 `over-write` されるため、
過去の院選択履歴が保持されず、LLMに渡される文脈が不十分。

### 対策

**院ステータス判定をコードノードに置き換える:**

```python
def main(sys_query: str, current_clinic: str) -> dict:
    selections = {
        "横浜駅前院": "横浜駅前院",
        "川崎駅前院": "川崎駅前院",
        "町田駅前院": "町田駅前院",
        "その他・決まっていない": "未定",
    }

    query = sys_query.strip()

    # 完全一致チェック（ボタン押下）
    if query in selections:
        return {
            "clinic": selections[query],
            "is_selection": True
        }

    # 現在の院を維持
    return {
        "clinic": current_clinic if current_clinic else "未選択",
        "is_selection": False
    }
```

これにより:
- ボタン押下（完全一致）は確実に判定
- 質問文中の院名は誤判定しない
- LLM呼び出し1回削減、レスポンス高速化

---

## 問題2: 回答にないURLを生成している

### 原因（3つ）

#### 原因A: temperature が高すぎる

| Bot | モデル | temperature |
|-----|--------|-------------|
| ルナレディース Answer Generation | gpt-5.4 | 未設定（デフォルト=1.0） |
| AdeB Answer Generation | gpt-4o | **0.7** |

FAQ回答のような「事実ベースの出力」では、temperature 0.7〜1.0 は高すぎる。
LLMが「それっぽいURL」を創作してしまう。

**対策: temperature を 0〜0.1 に下げる**

#### 原因B: score_threshold が未設定

両Botとも Knowledge Retrieval で `score_threshold: null`。
関連度の低いFAQ結果もAnswer Generationに渡されるため、
LLMが無関係なanswer内のURLと質問を混同し、存在しないURLを生成する。

**対策: score_threshold を 0.3〜0.5 に設定**

#### 原因C: プロンプトが長すぎてURLルールが埋もれる

ルナレディースのAnswer Generationプロンプトは約2000文字以上。
ルールが20以上あり、LLMがすべてを一貫して守れない。

特にURLルールは末尾の方にあるため、優先度が下がる。

**対策:**
- URLルールをプロンプトの冒頭付近（禁止事項の直後）に移動
- プロンプト全体を簡素化（重複ルールの統合）
- user メッセージ側で「URLはanswerに記載のもののみ。それ以外は絶対に出力禁止」と再強調

---

## 両Bot共通の改善項目まとめ

| 項目 | 現状 | 改善後 |
|------|------|--------|
| Answer Generation temperature | 0.7〜1.0 | **0〜0.1** |
| Knowledge Retrieval score_threshold | null | **0.3〜0.5** |
| Knowledge Retrieval reranking | false | **true** |
| URLルールの位置 | プロンプト末尾 | **冒頭付近に移動** |
| 院ステータス判定（ルナ） | LLM | **コードノード** |
| DETECT_LANGUAGE（ルナ） | LLM | **コードノード** |
| 履歴作成（ルナ） | LLM | **テンプレート** |
