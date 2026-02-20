import { useState } from 'react';
export default function ClientPage({ clientId }) {
  const [password, setPassword] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [selectedConv, setSelectedConv] = useState(null);
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
  const rows = data.rows;
  const clinicKey = Object.keys(rows[0]||{}).find(k=>k.includes('clinic'))||'clinic';
  const uniqueUsers = new Set(rows.map(r=>r['conversation_id'])).size;
  const uniqueChats = new Set(rows.map(r=>r['workflow_run_id'])).size;
  const phoneCount = rows.reduce((s,r)=>s+(parseInt(r['is_phone誘導数値'])||0),0);
  const selfSolveRate = uniqueChats>0?Math.round((uniqueChats-phoneCount)/uniqueChats*100):0;
  const dateCounts={};
  rows.forEach(r=>{const d=(r['タイムスタンプ（整形済み）']||'').slice(0,10);if(d)dateCounts[d]=(dateCounts[d]||0)+1;});
  const dailyData=Object.entries(dateCounts).sort().slice(-14).map(([d,v])=>({label:d.slice(5),value:v}));
  const maxDaily=Math.max(...dailyData.map(d=>d.value),1);
  const hourCounts={};
  for(let i=0;i<24;i++) hourCounts[i]=0;
  rows.forEach(r=>{const h=parseInt(r['タイムスタンプ（時間）']);if(!isNaN(h))hourCounts[h]=(hourCounts[h]||0)+1;});
  const hourData=Object.entries(hourCounts).sort((a,b)=>parseInt(a[0])-parseInt(b[0])).map(([h,v])=>({label:h+'時',value:v}));
  const maxHour=Math.max(...hourData.map(d=>d.value),1);
  const topicCounts={};
  rows.forEach(r=>{const t=r['topic_type']||'その他';topicCounts[t]=(topicCounts[t]||0)+1;});
  const topicData=Object.entries(topicCounts).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const colors=['#2563a8','#60a5fa','#34d399','#fbbf24','#f87171','#a78bfa'];
  const clinicCounts={};
  rows.forEach(r=>{const c=r[clinicKey]||'院指定なし';clinicCounts[c]=(clinicCounts[c]||0)+1;});
  const phoneRows=rows.filter(r=>parseInt(r['is_phone誘導数値'])===1&&r['user_question']);
  const convMap={};
  rows.forEach(r=>{
    if(!r['user_question']) return;
    const id=r['conversation_id']||r['timestamp'];
    if(!convMap[id])convMap[id]={id,rows:[],ts:r['タイムスタンプ（整形済み）']||r['timestamp'],clinic:r[clinicKey]||''};
    convMap[id].rows.push(r);
  });
  const convList=Object.values(convMap).sort((a,b)=>b.ts>a.ts?1:-1);
  const filtered=convList.filter(c=>!search||c.rows.some(r=>(r['user_question']||'').includes(search)||(r['ai_answer']||'').includes(search)));
  const kpis=[['利用人数',uniqueUsers,'#2563a8'],['総チャット件数',uniqueChats,'#10b981'],['電話誘導件数',phoneCount,'#f59e0b'],['自己解決率',selfSolveRate+'%','#6366f1']];
  const BarChart=({data,maxVal,color})=>(
    <div style={{display:'flex',alignItems:'flex-end',gap:3,height:100}}>
      {data.map((d,i)=>(
        <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
          <div style={{fontSize:8,color:'#999'}}>{d.value||''}</div>
          <div style={{width:'100%',background:color,height:`${(d.value/maxVal)*80}px`,borderRadius:'2px 2px 0 0',minHeight:d.value?2:0}}/>
          <div style={{fontSize:8,color:'#bbb'}}>{d.label}</div>
        </div>
      ))}
    </div>
  );
  return (
    <div style={{background:'#f8f7f4',minHeight:'100vh',fontFamily:'sans-serif'}}>
      <div style={{background:'white',padding:'16px 32px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)',display:'flex',alignItems:'center',gap:16}}>
        <div style={{fontSize:18,fontWeight:700,color:'#2563a8'}}>SuguDesk</div>
        <div style={{color:'#ddd'}}>|</div>
        <div style={{fontSize:15,color:'#333'}}>{data.clientName}</div>
      </div>
      <div style={{padding:'24px 32px',maxWidth:1400,margin:'0 auto'}}>
        <div style={{display:'flex',gap:4,marginBottom:24,borderBottom:'1px solid #e5e7eb'}}>
          {['overview','logs'].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:'8px 20px',cursor:'pointer',fontWeight:600,fontSize:14,background:'none',border:'none',borderBottom:tab===t?'2px solid #2563a8':'2px solid transparent',color:tab===t?'#2563a8':'#999'}}>
              {t==='overview'?'概要':'会話ログ'}
            </button>
          ))}
        </div>
        {tab==='overview'&&<>
          <div style={{display:'flex',gap:16,marginBottom:24,flexWrap:'wrap'}}>
            {kpis.map(([title,value,color])=>(
              <div key={title} style={{background:'white',borderRadius:12,padding:'20px 24px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)',borderTop:`3px solid ${color}`,flex:1,minWidth:150}}>
                <div style={{fontSize:13,color:'#999',marginBottom:8}}>{title}</div>
                <div style={{fontSize:36,fontWeight:700,color}}>{value}</div>
              </div>
            ))}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
            <div style={{background:'white',borderRadius:12,padding:24,boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
              <div style={{fontSize:14,fontWeight:600,marginBottom:16,color:'#333'}}>日別会話数（直近14日）</div>
              <BarChart data={dailyData} maxVal={maxDaily} color="#2563a8" />
            </div>
            <div style={{background:'white',borderRadius:12,padding:24,boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
              <div style={{fontSize:14,fontWeight:600,marginBottom:16,color:'#333'}}>時間別会話数</div>
              <BarChart data={hourData} maxVal={maxHour} color="#60a5fa" />
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
            <div style={{background:'white',borderRadius:12,padding:24,boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
              <div style={{fontSize:14,fontWeight:600,marginBottom:16,color:'#333'}}>トピック分布</div>
              {topicData.map(([label,value],i)=>(
                <div key={i} style={{marginBottom:8}}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:3}}>
                    <span style={{color:'#555'}}>{label}</span><span style={{color:'#999'}}>{value}</span>
                  </div>
                  <div style={{background:'#f0f0f0',borderRadius:4,height:6}}>
                    <div style={{background:colors[i%colors.length],height:6,borderRadius:4,width:`${(value/rows.length)*100}%`}}/>
                  </div>
                </div>
              ))}
            </div>
            <div style={{background:'white',borderRadius:12,padding:24,boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
              <div style={{fontSize:14,fontWeight:600,marginBottom:16,color:'#333'}}>院別会話数</div>
              {Object.entries(clinicCounts).sort((a,b)=>b[1]-a[1]).map(([clinic,count],i)=>(
                <div key={i} style={{marginBottom:8}}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:3}}>
                    <span style={{color:'#555'}}>{clinic}</span><span style={{color:'#999'}}>{count}</span>
                  </div>
                  <div style={{background:'#f0f0f0',borderRadius:4,height:6}}>
                    <div style={{background:'#10b981',height:6,borderRadius:4,width:`${(count/rows.length)*100}%`}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>}
        {tab==='logs'&&(
          <div style={{display:'grid',gridTemplateColumns:'260px 1fr 260px',gap:16,height:'calc(100vh - 200px)'}}>
            <div style={{background:'white',borderRadius:12,overflow:'hidden',boxShadow:'0 1px 4px rgba(0,0,0,0.06)',display:'flex',flexDirection:'column'}}>
              <div style={{padding:'12px 14px',borderBottom:'1px solid #f0f0f0',fontSize:13,fontWeight:600,color:'#333'}}>会話一覧</div>
              <div style={{padding:8,borderBottom:'1px solid #f0f0f0'}}>
                <input placeholder="検索..." value={search} onChange={e=>setSearch(e.target.value)} style={{width:'100%',padding:'6px 10px',border:'1px solid #e5e7eb',borderRadius:8,fontSize:13,boxSizing:'border-box',outline:'none'}}/>
              </div>
              <div style={{overflow:'auto',flex:1}}>
                {filtered.map(c=>(
                  <div key={c.id} onClick={()=>setSelectedConv(c)} style={{padding:'10px 14px',borderBottom:'1px solid #f5f5f5',cursor:'pointer',background:selectedConv?.id===c.id?'#eff6ff':'white',borderLeft:selectedConv?.id===c.id?'3px solid #2563a8':'3px solid transparent'}}>
                    <div style={{fontSize:11,color:'#bbb',marginBottom:3}}>{c.ts?.slice(0,10)}</div>
                    {c.clinic&&<div style={{fontSize:10,color:'#2563a8',marginBottom:2}}>{c.clinic}</div>}
                    <div style={{fontSize:13,color:'#555',overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>{c.rows[0]?.['user_question']?.slice(0,28)}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:'white',borderRadius:12,padding:24,boxShadow:'0 1px 4px rgba(0,0,0,0.06)',overflow:'auto'}}>
              {!selectedConv?<div style={{color:'#ccc',textAlign:'center',marginTop:80,fontSize:14}}>← 会話を選択してください</div>:
                <>
                  <div style={{fontSize:12,color:'#bbb',marginBottom:16}}>{selectedConv.ts} {selectedConv.clinic&&`| ${selectedConv.clinic}`}</div>
                  {selectedConv.rows.map((r,i)=>(
                    <div key={i}>
                      {r['user_question']&&<div style={{display:'flex',justifyContent:'flex-end',marginBottom:10}}><div style={{background:'#2563a8',color:'white',borderRadius:'12px 12px 2px 12px',padding:'8px 14px',maxWidth:'70%',fontSize:14,lineHeight:1.6}}>{r['user_question']}</div></div>}
                      {r['ai_answer']&&<div style={{display:'flex',marginBottom:14}}><div style={{background:'#f5f5f5',color:'#333',borderRadius:'12px 12px 12px 2px',padding:'8px 14px',maxWidth:'70%',fontSize:14,lineHeight:1.6}}>{r['ai_answer']}</div></div>}
                    </div>
                  ))}
                </>
              }
            </div>
            <div style={{background:'white',borderRadius:12,overflow:'hidden',boxShadow:'0 1px 4px rgba(0,0,0,0.06)',display:'flex',flexDirection:'column'}}>
              <div style={{padding:'12px 14px',borderBottom:'1px solid #f0f0f0',fontSize:13,fontWeight:600,color:'#f59e0b'}}>📞 電話誘導 ({phoneRows.length}件)</div>
              <div style={{overflow:'auto',flex:1}}>
                {phoneRows.map((r,i)=>(
                  <div key={i} style={{padding:'10px 14px',borderBottom:'1px solid #f5f5f5'}}>
                    <div style={{fontSize:11,color:'#bbb',marginBottom:4}}>{r['タイムスタンプ（整形済み）']?.slice(0,10)}</div>
                    <div style={{fontSize:13,color:'#555',lineHeight:1.5}}>{r['user_question']}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export async function getServerSideProps({params}){return{props:{clientId:params.client}};}