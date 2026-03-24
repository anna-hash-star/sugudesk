import { useState } from 'react';

const isPhoneEscalation = (r) => {
  const v = r['is_phone_escalation'];
  return v === 'true' || v === 'TRUE' || v === 'あり';
};

const getDate = (r) => r['formatted_date'] || r['タイムスタンプ（整形済み）'] || '';
const getHour = (r) => r['hour'] !== undefined ? r['hour'] : r['タイムスタンプ（時間）'];

const IMPROVEMENT_COLORS = {
  '正常回答': '#10b981','FAQ追加': '#ef4444','FAQ修正': '#f59e0b',
  '正規化改善': '#eab308','検索精度改善': '#8b5cf6','対応不要': '#6b7280',
};
const PRIORITY_COLORS = { 'high': '#ef4444', 'medium': '#eab308', 'low': '#10b981' };
const PRIORITY_LABELS = { 'high': '🔴 high', 'medium': '🟡 medium', 'low': '🟢 low' };

export default function ClientPage({ clientId }) {
  const [password, setPassword] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [logFilter, setLogFilter] = useState('all');
  const [selectedConv, setSelectedConv] = useState(null);
  const [period, setPeriod] = useState(30);

  const handleLogin = async () => {
    setLoading(true); setError('');
    const res = await fetch('/api/data', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({clientId, password}) });
    const json = await res.json();
    if (!res.ok) setError('パスワードが違います'); else setData(json);
    setLoading(false);
  };

  if (!data) return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',background:'#f8f7f4',fontFamily:'sans-serif'}}>
      <div style={{background:'white',borderRadius:16,padding:48,boxShadow:'0 4px 24px rgba(0,0,0,0.10)',textAlign:'center',minWidth:320}}>
        <div style={{fontSize:24,fontWeight:700,color:'#2563a8',marginBottom:8}}>SuguDesk</div>
        <div style={{fontSize:14,color:'#888',marginBottom:32}}>クライアントダッシュボード</div>
        <input type="password" placeholder="パスワードを入力" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()} style={{padding:'10px 16px',fontSize:15,width:'100%',boxSizing:'border-box',border:'1px solid #ddd',borderRadius:8,marginBottom:12,outline:'none'}} />
        {error && <p style={{color:'#ef4444',fontSize:13,marginBottom:8}}>{error}</p>}
        <button onClick={handleLogin} disabled={loading} style={{width:'100%',padding:'10px 0',background:'#2563a8',color:'white',border:'none',borderRadius:8,fontSize:15,cursor:'pointer',fontWeight:600}}>{loading?'ログイン中...':'ログイン'}</button>
      </div>
    </div>
  );

  const allRows = data.rows;
  const clinicKey = Object.keys(allRows[0]||{}).find(k=>k.includes('clinic'))||'clinic';

 const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - period);
  const filteredRows = period === 0 ? allRows : allRows.filter(r => {
    const d = getDate(r);
    if (!d) return false;
    return new Date(d.replace(/\//g,'-')) >= cutoff;
  });

  const uniqueUsers = new Set(filteredRows.map(r=>r['conversation_id']).filter(v=>v&&v.trim())).size;
  const uniqueChats = new Set(filteredRows.map(r=>r['workflow_run_id']).filter(v=>v&&v.trim())).size;
  const phoneCount = filteredRows.filter(isPhoneEscalation).length;
  const selfSolveRate = uniqueChats > 0 ? Math.round((1 - phoneCount / uniqueChats) * 100) : 0;

  const dateCounts = {};
  filteredRows.forEach(r => { const d = getDate(r).slice(0,10); if(d) dateCounts[d] = (dateCounts[d]||0)+1; });
  const dailyData = Object.entries(dateCounts).sort().slice(-14).map(([d,v])=>({label:d.slice(5),value:v}));
  const maxDaily = Math.max(...dailyData.map(d=>d.value), 1);

  const hourCounts = {};
  for(let i=0;i<24;i++) hourCounts[i]=0;
  filteredRows.forEach(r => { const h = parseInt(getHour(r)); if(!isNaN(h)) hourCounts[h] = (hourCounts[h]||0)+1; });
  const hourData = Object.entries(hourCounts).sort((a,b)=>parseInt(a[0])-parseInt(b[0])).map(([h,v])=>({label:h+'時',value:v}));
  const maxHour = Math.max(...hourData.map(d=>d.value), 1);

  const topicCounts = {};
  filteredRows.forEach(r => { const t = r['topic_type']; if(t&&t.trim()) topicCounts[t] = (topicCounts[t]||0)+1; });
  const topicData = Object.entries(topicCounts).sort((a,b)=>b[1]-a[1]).slice(0,10);
  const topicColors = ['#2563a8','#60a5fa','#34d399','#fbbf24','#f87171','#a78bfa','#fb923c','#38bdf8','#4ade80','#f472b6'];

  const menuCounts = {};
  filteredRows.forEach(r => { const m = r['menu_category']; if(m&&m.trim()) menuCounts[m] = (menuCounts[m]||0)+1; });
  const menuData = Object.entries(menuCounts).sort((a,b) => {
    if (a[0].includes('指定なし') || a[0].includes('その他')) return 1;
    if (b[0].includes('指定なし') || b[0].includes('その他')) return -1;
    return b[1] - a[1];
  });
  const maxMenu = Math.max(...menuData.map(d=>d[1]), 1);

  const clinicCounts = {};
  filteredRows.forEach(r => { const c = (r[clinicKey]||'').trim(); if(c) clinicCounts[c] = (clinicCounts[c]||0)+1; });

  const improvementCounts = {};
  filteredRows.forEach(r => { const v = r['improvement_action']; if(v&&v.trim()) improvementCounts[v] = (improvementCounts[v]||0)+1; });
  const improvementData = Object.entries(improvementCounts).sort((a,b)=>b[1]-a[1]);
  const maxImprovement = Math.max(...improvementData.map(d=>d[1]), 1);

  const priorityCounts = {};
  filteredRows.forEach(r => { const v = r['priority']; if(v&&v.trim()) priorityCounts[v] = (priorityCounts[v]||0)+1; });
  const priorityData = ['high','medium','low'].filter(p=>priorityCounts[p]).map(p=>([p, priorityCounts[p]]));
  const maxPriority = Math.max(...priorityData.map(d=>d[1]), 1);

  const convMap = {};
  allRows.forEach(r => {
    if(!r['user_question']) return;
    const id = r['conversation_id'] || r['timestamp'];
    if(!convMap[id]) convMap[id] = {id, rows:[], ts:'', clinic:r[clinicKey]||''};
    convMap[id].ts = getDate(r) || r['timestamp'];
    convMap[id].rows.push(r);
  });

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const convList = Object.values(convMap)
    .filter(c => new Date(c.ts.replace(/\//g,'-')) >= thirtyDaysAgo)
    .sort((a,b) => b.ts > a.ts ? 1 : -1);

  const isNeedsImprovement = (rows) => rows.some(r => ['FAQ追加','FAQ修正','正規化改善','検索精度改善'].includes(r['improvement_action']));
  const isNormal = (rows) => rows.every(r => !r['improvement_action'] || r['improvement_action'] === '正常回答' || r['improvement_action'] === '対応不要');

  const filtered = convList.filter(c => {
    if (logFilter === 'phone') return c.rows.some(r => isPhoneEscalation(r));
    if (logFilter === 'improvement') return isNeedsImprovement(c.rows);
    if (logFilter === 'normal') return isNormal(c.rows);
    return true;
  }).filter(c => !search || c.rows.some(r => (r['user_question']||'').includes(search)||(r['ai_answer']||'').includes(search)));

  const kpis = [
    ['利用人数', uniqueUsers, '#2563a8'],
    ['総チャット件数', uniqueChats, '#10b981'],
    ['電話誘導件数', phoneCount, '#f59e0b'],
    ['自己解決率', selfSolveRate+'%', '#6366f1'],
  ];

  const BarChart = ({data, maxVal, defaultColor}) => (
    <div style={{display:'flex',alignItems:'flex-end',gap:3,height:100}}>
      {data.map((d,i) => (
        <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
          <div style={{fontSize:8,color:'#999'}}>{d.value||''}</div>
          <div style={{width:'100%',background:defaultColor||'#2563a8',height:`${(d.value/maxVal)*80}px`,borderRadius:'2px 2px 0 0',minHeight:d.value?2:0}}/>
          <div style={{fontSize:8,color:'#bbb'}}>{d.label}</div>
        </div>
      ))}
    </div>
  );

  const HBarChart = ({data, maxVal, colorFn, defaultColor}) => (
    <div>
      {data.map(([label, value], i) => (
        <div key={i} style={{marginBottom:8}}>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:3}}>
            <span style={{color:'#555'}}>{label}</span>
            <span style={{color:'#999'}}>{value}</span>
          </div>
          <div style={{background:'#f0f0f0',borderRadius:4,height:6}}>
            <div style={{background:colorFn?colorFn(label,i):(defaultColor||'#2563a8'),height:6,borderRadius:4,width:`${(value/maxVal)*100}%`}}/>
          </div>
        </div>
      ))}
    </div>
  );

  const periodLabels = [{v:7,l:'直近7日'},{v:14,l:'直近14日'},{v:30,l:'直近30日'},{v:0,l:'全期間'}];
  const selectedPhoneRow = selectedConv?.rows?.find(r => isPhoneEscalation(r));
const selectedFirstRow = selectedPhoneRow || selectedConv?.rows?.[0];

  return (
    <div style={{background:'#f8f7f4',minHeight:'100vh',fontFamily:'sans-serif'}}>
      <div style={{background:'white',padding:'16px 32px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)',display:'flex',alignItems:'center',gap:16}}>
        <div style={{fontSize:18,fontWeight:700,color:'#2563a8'}}>SuguDesk</div>
        <div style={{color:'#ddd'}}>|</div>
        <div style={{fontSize:15,color:'#333'}}>{data.clientName}</div>
      </div>
      <div style={{padding:'24px 32px',maxWidth:1400,margin:'0 auto'}}>
        <div style={{display:'flex',gap:4,marginBottom:16,borderBottom:'1px solid #e5e7eb'}}>
          {['overview','logs'].map(t => (
            <button key={t} onClick={()=>setTab(t)} style={{padding:'8px 20px',cursor:'pointer',fontWeight:600,fontSize:14,background:'none',border:'none',borderBottom:tab===t?'2px solid #2563a8':'2px solid transparent',color:tab===t?'#2563a8':'#999'}}>
              {t==='overview'?'概要':'会話ログ'}
            </button>
          ))}
        </div>
        <div style={{display:'flex',gap:8,marginBottom:24}}>
          {periodLabels.map(({v,l}) => (
            <button key={v} onClick={()=>setPeriod(v)} style={{padding:'6px 14px',borderRadius:20,border:`1px solid ${period===v?'#2563a8':'#e5e7eb'}`,background:period===v?'#2563a8':'white',color:period===v?'white':'#555',fontSize:13,cursor:'pointer',fontWeight:period===v?600:400}}>
              {l}
            </button>
          ))}
        </div>
        {tab==='overview' && <>
          <div style={{display:'flex',gap:16,marginBottom:24,flexWrap:'wrap'}}>
            {kpis.map(([title,value,color]) => (
              <div key={title} style={{background:'white',borderRadius:12,padding:'20px 24px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)',borderTop:`3px solid ${color}`,flex:1,minWidth:150}}>
                <div style={{fontSize:13,color:'#999',marginBottom:8}}>{title}</div>
                <div style={{fontSize:36,fontWeight:700,color}}>{value}</div>
              </div>
            ))}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
            <div style={{background:'white',borderRadius:12,padding:24,boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
              <div style={{fontSize:14,fontWeight:600,marginBottom:16,color:'#333'}}>日別会話数（直近14日）</div>
              <BarChart data={dailyData} maxVal={maxDaily} defaultColor="#2563a8" />
            </div>
            <div style={{background:'white',borderRadius:12,padding:24,boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
              <div style={{fontSize:14,fontWeight:600,marginBottom:16,color:'#333'}}>時間別会話数</div>
              <BarChart data={hourData} maxVal={maxHour} defaultColor="#60a5fa" />
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:clientId==='lunaladies'?'1fr 1fr 1fr':'1fr 1fr',gap:16,marginBottom:16}}>
            <div style={{background:'white',borderRadius:12,padding:24,boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
              <div style={{fontSize:14,fontWeight:600,marginBottom:16,color:'#333'}}>トピック分布</div>
              <HBarChart data={topicData} maxVal={Math.max(...topicData.map(d=>d[1]),1)} colorFn={(_,i)=>topicColors[i%topicColors.length]} />
            </div>
            <div style={{background:'white',borderRadius:12,padding:24,boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
              <div style={{fontSize:14,fontWeight:600,marginBottom:16,color:'#333'}}>メニューカテゴリ分布</div>
              <HBarChart data={menuData} maxVal={maxMenu} defaultColor="#10b981" />
            </div>
            {clientId==='lunaladies'&&(
              <div style={{background:'white',borderRadius:12,padding:24,boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
                <div style={{fontSize:14,fontWeight:600,marginBottom:16,color:'#333'}}>院別会話数</div>
                <HBarChart data={Object.entries(clinicCounts).sort((a,b)=>b[1]-a[1])} maxVal={Math.max(...Object.values(clinicCounts),1)} defaultColor="#6366f1" />
              </div>
            )}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
            <div style={{background:'white',borderRadius:12,padding:24,boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
              <div style={{fontSize:14,fontWeight:600,marginBottom:16,color:'#333'}}>改善アクション内訳</div>
              {improvementData.length > 0
                ? <HBarChart data={improvementData} maxVal={maxImprovement} colorFn={(label)=>IMPROVEMENT_COLORS[label]||'#6b7280'} />
                : <div style={{color:'#ccc',fontSize:13}}>データなし（旧データのみ）</div>}
            </div>
            <div style={{background:'white',borderRadius:12,padding:24,boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
              <div style={{fontSize:14,fontWeight:600,marginBottom:16,color:'#333'}}>優先度分布</div>
              {priorityData.length > 0
                ? <HBarChart data={priorityData} maxVal={maxPriority} colorFn={(label)=>PRIORITY_COLORS[label]||'#6b7280'} />
                : <div style={{color:'#ccc',fontSize:13}}>データなし（旧データのみ）</div>}
            </div>
          </div>
        </>}
        {tab==='logs' && (
          <div style={{display:'grid',gridTemplateColumns:'260px 1fr 260px',gap:16,height:'calc(100vh - 220px)'}}>
            <div style={{background:'white',borderRadius:12,overflow:'hidden',boxShadow:'0 1px 4px rgba(0,0,0,0.06)',display:'flex',flexDirection:'column'}}>
              <div style={{padding:'12px 14px',borderBottom:'1px solid #f0f0f0',fontSize:13,fontWeight:600,color:'#333'}}>会話一覧</div>
              <div style={{padding:8,borderBottom:'1px solid #f0f0f0'}}>
                <input placeholder="検索..." value={search} onChange={e=>setSearch(e.target.value)} style={{width:'100%',padding:'6px 10px',border:'1px solid #e5e7eb',borderRadius:8,fontSize:13,boxSizing:'border-box',outline:'none'}}/>
              </div>
              <div style={{padding:'6px 8px',borderBottom:'1px solid #f0f0f0',display:'flex',gap:4,flexWrap:'wrap'}}>
                {[['all','すべて'],['phone','電話誘導'],['improvement','要改善'],['normal','正常']].map(([v,l]) => (
                  <button key={v} onClick={()=>setLogFilter(v)} style={{padding:'3px 8px',borderRadius:12,border:`1px solid ${logFilter===v?'#2563a8':'#e5e7eb'}`,background:logFilter===v?'#eff6ff':'white',color:logFilter===v?'#2563a8':'#777',fontSize:11,cursor:'pointer'}}>
                    {l}
                  </button>
                ))}
              </div>
              <div style={{overflow:'auto',flex:1}}>
                {filtered.map(c => {
                  const hasPhone = c.rows.some(r => isPhoneEscalation(r));
                  const hasImprovement = isNeedsImprovement(c.rows);
                  return (
                    <div key={c.id} onClick={()=>setSelectedConv(c)} style={{padding:'10px 14px',borderBottom:'1px solid #f5f5f5',cursor:'pointer',background:selectedConv?.id===c.id?'#eff6ff':'white',borderLeft:selectedConv?.id===c.id?'3px solid #2563a8':'3px solid transparent'}}>
                      <div style={{fontSize:11,color:'#bbb',marginBottom:3,display:'flex',gap:4,alignItems:'center'}}>
                        {c.ts?.slice(0,10)}{hasPhone&&<span>📞</span>}{hasImprovement&&<span>⚠️</span>}
                      </div>
                      {c.clinic&&<div style={{fontSize:10,color:'#2563a8',marginBottom:2}}>{c.clinic}</div>}
                      <div style={{fontSize:13,color:'#555',overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>{c.rows[0]?.['user_question']?.slice(0,28)}</div>

                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{background:'white',borderRadius:12,padding:24,boxShadow:'0 1px 4px rgba(0,0,0,0.06)',overflow:'auto'}}>
              {!selectedConv
                ? <div style={{color:'#ccc',textAlign:'center',marginTop:80,fontSize:14}}>← 会話を選択してください</div>
                : <>
                  <div style={{fontSize:12,color:'#bbb',marginBottom:16}}>{selectedConv.ts} {selectedConv.clinic&&`| ${selectedConv.clinic}`}</div>
                  {selectedConv.rows.map((r,i) => (
                    <div key={i}>
                      {r['user_question']&&<div style={{display:'flex',justifyContent:'flex-end',marginBottom:10}}><div style={{background:'#2563a8',color:'white',borderRadius:'12px 12px 2px 12px',padding:'8px 14px',maxWidth:'70%',fontSize:14,lineHeight:1.6}}>{r['user_question']}</div></div>}
                      {r['ai_answer']&&<div style={{display:'flex',marginBottom:14}}><div style={{background:'#f5f5f5',color:'#333',borderRadius:'12px 12px 12px 2px',padding:'8px 14px',maxWidth:'70%',fontSize:14,lineHeight:1.6}}>{r['ai_answer']}</div></div>}
                    </div>
                  ))}
                </>
              }
            </div>
            <div style={{background:'white',borderRadius:12,overflow:'hidden',boxShadow:'0 1px 4px rgba(0,0,0,0.06)',display:'flex',flexDirection:'column'}}>
              <div style={{padding:'12px 14px',borderBottom:'1px solid #f0f0f0',fontSize:13,fontWeight:600,color:'#2563a8'}}>📋 分類結果</div>
              <div style={{overflow:'auto',flex:1,padding:14}}>
                {!selectedConv
                  ? <div style={{color:'#ccc',fontSize:13,textAlign:'center',marginTop:40}}>← 会話を選択してください</div>
                  : !selectedFirstRow?.['improvement_action'] && !selectedFirstRow?.['topic_type']
                  ? <div style={{color:'#bbb',fontSize:12}}>分類データなし（旧データ）</div>
                  : <div style={{fontSize:13}}>
                      {[['トピック',selectedFirstRow?.['topic_type']],['メニュー',selectedFirstRow?.['menu_category']],['類似FAQ',selectedFirstRow?.['similar_faq_exists']==='true'?'あり':selectedFirstRow?.['similar_faq_exists']==='false'?'なし':''],['メモ',selectedFirstRow?.['note']]].map(([label,value])=>value?(
                        <div key={label} style={{marginBottom:12}}>
                          <div style={{color:'#999',fontSize:11,marginBottom:3}}>{label}</div>
                          <div style={{color:'#333'}}>{value}</div>
                        </div>
                      ):null)}
                      <div style={{marginBottom:12}}>
                        <div style={{color:'#999',fontSize:11,marginBottom:3}}>電話誘導</div>
                        <div>{selectedConv.rows.some(r=>isPhoneEscalation(r))?'✅ あり':'❌ なし'}</div>
                      </div>
                      {selectedFirstRow?.['improvement_action']&&(
                        <div style={{marginBottom:12}}>
                          <div style={{color:'#999',fontSize:11,marginBottom:3}}>改善アクション</div>
                          <span style={{background:IMPROVEMENT_COLORS[selectedFirstRow['improvement_action']]||'#6b7280',color:'white',padding:'2px 8px',borderRadius:10,fontSize:12}}>{selectedFirstRow['improvement_action']}</span>
                        </div>
                      )}
                      {selectedFirstRow?.['priority']&&(
                        <div style={{marginBottom:12}}>
                          <div style={{color:'#999',fontSize:11,marginBottom:3}}>優先度</div>
                          <div style={{color:PRIORITY_COLORS[selectedFirstRow['priority']]||'#333',fontWeight:600}}>{PRIORITY_LABELS[selectedFirstRow['priority']]||selectedFirstRow['priority']}</div>
                        </div>
                      )}
                    </div>
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps({params}){return{props:{clientId:params.client}};}