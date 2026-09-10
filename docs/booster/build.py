#!/usr/bin/env python3
"""docs/booster の HTML を PDF 化し、フッター（タイトル | ページ番号）を付ける。
   使い方: python3 docs/booster/build.py  → 同ディレクトリに PDF を出力"""
import glob, os, subprocess, sys, tempfile
import pymupdf as fitz

HERE = os.path.dirname(os.path.abspath(__file__))
DOCS = [
    ("採用ブースター_要件定義書_v1.3.html", "採用ブースター 要件定義書"),
    ("採用ブースター_概算工数見積書_v1.3.html", "採用ブースター 概算工数見積書"),
]


def chromium():
    for pat in ("/opt/pw-browsers/chromium-*/chrome-linux/chrome",
                "/opt/pw-browsers/chromium-*/chrome-linux64/chrome",
                "/opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell"):
        m = sorted(glob.glob(pat))
        if m:
            return m[-1]
    return "chromium"


def font_file():
    out = subprocess.run(["fc-match", "-f", "%{file}", "IPAPGothic"], capture_output=True, text=True).stdout.strip()
    return out or None


def build(html_name, footer_title):
    src = os.path.join(HERE, html_name)
    out_pdf = os.path.join(HERE, html_name[:-5] + ".pdf")
    tmp = tempfile.mktemp(suffix=".pdf")
    subprocess.run([
        chromium(), "--headless=new", "--no-sandbox", "--disable-gpu",
        "--no-pdf-header-footer", f"--print-to-pdf={tmp}", "file://" + src,
    ], check=True, capture_output=True)

    doc = fitz.open(tmp)
    ff = font_file()
    font = fitz.Font(fontfile=ff) if ff else fitz.Font("japan")
    n = doc.page_count
    for i, page in enumerate(doc):
        w, h = page.rect.width, page.rect.height
        text = f"{footer_title}  |  {i + 1}"
        fs = 8.5
        tw = font.text_length(text, fontsize=fs)
        x = w - 20 * 72 / 25.4 - tw  # 右余白 20mm に揃える
        y = h - 12 * 72 / 25.4
        fname = "ipa" if ff else "japan"
        if ff:
            page.insert_font(fontname="ipa", fontfile=ff)
        page.insert_text((x, y), text, fontname=fname, fontsize=fs, color=(0.35, 0.35, 0.35))
    doc.save(out_pdf, garbage=3, deflate=True)
    doc.close()
    os.remove(tmp)
    print(f"{out_pdf}  ({n} pages)")
    return out_pdf, n


if __name__ == "__main__":
    for name, title in DOCS:
        build(name, title)
