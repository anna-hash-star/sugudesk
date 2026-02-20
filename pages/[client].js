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
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',background:'#0f1117',fontFamily:'sans-serif'}}>
      <div style={{background:'#1a1d27',borderRadius:16,padding:48,boxShadow:'0 4px 32px rgba(0,0,0,0.4)',textAlign:'center',minWidth:320,border:'1px solid #2a2d3a'}}>
        <div style={{fontSize:24,fontWeight:700,color:'#60a5fa',marginBottom:8}}>SuguDesk</div>
        <div style={{fontSize:14,color:'#666',marginBottom:32}}>クライアントダッシュボード</div>
        <input type="password" placeholder="パスワードを入力" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()} style={{padding:'10px 16px',fontSize:15,width:'100%',boxSizing:'border-box',border:'1px solid #2a2d3a',borderRadius:8,marginBottom:12,outline:'none',background:'#0f1117',color:'white'}} />
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
  const clinicCounts={};
  rows.forEach(r=>{const c=r[clinicKey]||'院指定なし';clinicCounts[c]=(clinicCounts[c]||0)+1;});
  const dateCounts={};
  rows.forEach(r=>{const d=(r['タイムスタンプ（整形済み）']||'').slice(0,10);if(d)dateCounts[d]=(dateCounts[d]||0)+1;});
  const dailyData=Object.entries(dateCounts).sort().slice(-14).map(([d,v])=>({label:d.slice(5),value:v}));
  const maxBar=Math.max(...dailyData.map(d=>d.value),1);
  const topicCounts={};
  rows.forEach(r=>{const t=r['topic_type']||'その他';topicCounts[t]=(topicCounts[t]||0)+1;});
  const topicData=Object.entries(topicCounts).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const colors=['#60a5fa','#34d399','#fbbf24','#f87171','#a78bfa','#fb923c'];
  const convMap={};
  rows.forEach(r=>{
    if(!r['user_question']) return;
    const id=r['conversation_id']||r['timestamp'];
    if(!convMap[id])convMap[id]={id,rows:[],ts:r['タイムスタンプ（整形済み）']||r['timestamp'],clinic:r[clinicKey]||''};
    convMap[id].rows.push(r);
  });
  const convList=Object.values(convMap).sort((a,b)=>b.ts>a.ts?1:-1);
  const filtered=convList.filter(c=>!search||c.rows.some(r=>(r['user_question']||'').includes(search)||(r['ai_answer']||'').includes(search)));
  const kpis=[['利用人数',uniqueUsers,'#60a5fa'],['総チャット件数',uniqueChats,'#34d399'],['電話誘導件数',phoneCount,'#f87171'],['自己解決率',selfSolveRate+'%','#fbbf24']];
  return (
    <div style={{background:'#0f1117',minHeight:'100vh',fontFamily:'sans-serif',color:'white'}}>
      <div style={{background:'#1a1d27',padding:'16px 32px',borderBottom:'1px solid #2a2d3a',display:'flex',alignItems:'center',gap:16}}>
        <div style={{fontSize:18,fontWeight:700,color:'#60a5fa'}}>SuguDesk</div>
        <div style={{color:'#333'}}>|</div>
        <div style={{fontSize:15,color:'#ccc'}}>{data.clientName}</div>
      </div>
      <div style={{padding:'24px 32px',maxWidth:1200,margin:'0 auto'}}>
        <div style={{display:'flex',gap:4,marginBottom:24,borderBottom:'1px solid #2a2d3a'}}>
          {['overview','logs'].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:'8px 20px',cursor:'pointer',fontWeight:600,fontSize:14,background:'none',border:'none',borderBottom:tab===t?'2px solid #60a5fa':'2px solid transparent',color:tab===t?'#60a5fa':'#666'}}>
              {t==='overview'?'概要':'会話ログ'}
            </button>
          ))}
        </div>
        {tab==='overview'&&<>
          <div style={{display:'flex',gap:16,marginBottom:24,flexWrap:'wrap'}}>
            {kpis.map(([title,value,color])=>(
              <div key={title} style={{background:'#1a1d27',borderRadius:12,padding:'20px 24px',border:'1px solid #2a2d3a',borderTop:`3px solid ${color}`,flex:1,minWidth:150}}>
                <div style={{fontSize:13,color:'#666',marginBottom:8}}>{title}</div>
                <div style={{fontSize:36,fontWeight:700,color}}>{value}</div>
              </div>
            ))}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
            <div style={{background:'#1a1d27',borderRadius:12,padding:24,border:'1px solid #2a2d3a'}}>
              <div style={{fontSize:14,fontWeight:600,marginBottom:16,color:'#ccc'}}>日別会話数（直近14日）</div>
              <div style={{display:'flex',alignItems:'flex-end',gap:4,height:120}}>
                {dailyData.map((d,i)=>(
                  <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                    <div style={{fontSize:9,color:'#666'}}>{d.value}</div>
                    <div style={{width:'100%',background:'#2563a8',height:`${(d.value/maxBar)*90}px`,borderRadius:'2px 2px 0 0',minHeight:2}}/>
                    <div style={{fontSize:8,color:'#555'}}>{d.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:'#1a1d27',borderRadius:12,padding:24,border:'1px solid #2a2d3a'}}>
              <div style={{fontSize:14,fontWeight:600,marginBottom:16,color:'#ccc'}}>トピック分布</div>
              {topicData.map(([label,value],i)=>(
                <div key={i} style={{marginBottom:8}}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:3}}>
                    <span style={{color:'#aaa'}}>{label}</span><span style={{color:'#666'}}>{value}</span>
                  </div>
                  <div style={{background:'#0f1117',borderRadius:4,height:6}}>
                    <div style={{background:colors[i%colors.length],height:6,borderRadius:4,width:`${(value/rows.length)*100}%`}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{background:'#1a1d27',borderRadius:12,padding:24,border:'1px solid #2a2d3a'}}>
            <div style={{fontSize:14,fontWeight:600,marginBottom:16,color:'#ccc'}}>院別会話数</div>
            {Object.entries(clinicCounts).sort((a,b)=>b[1]-a[1]).map(([clinic,count],i)=>(
              <div key={i} style={{marginBottom:8}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:3}}>
                  <span style={{color:'#aaa'}}>{clinic}</span><span style={{color:'#666'}}>{count}</span>
                </div>
                <div style={{background:'#0f1117',borderRadius:4,height:6}}>
                  <div style={{background:'#34d399',height:6,borderRadius:4,width:`${(count/rows.length)*100}%`}}/>
                </div>
              </div>
            ))}
          </div>
        </>}
        {tab==='logs'&&(
          <div style={{display:'grid',gridTemplateColumns:'300px 1fr',gap:16,height:'calc(100vh - 200px)'}}>
            <div style={{background:'#1a1d27',borderRadius:12,overflow:'hidden',border:'1px solid #2a2d3a',display:'flex',flexDirection:'column'}}>
              <div style={{padding:12,borderBottom:'1px solid #2a2d3a'}}>
                <input placeholder="検索..." value={search} onChange={e=>setSearch(e.target.value)} style={{width:'100%',padding:'7px 10px',border:'1px solid #2a2d3a',borderRadius:8,fontSize:13,boxSizing:'border-box',outline:'none',background:'#0f1117',color:'white'}}/>
              </div>
              <div style={{overflow:'auto',flex:1}}>
                {filtered.map(c=>(
                  <div key={c.id} onClick={()=>setSelectedConv(c)} style={{padding:'10px 14px',borderBottom:'1px solid #1e2030',cursor:'pointer',background:selectedConv?.id===c.id?'#1e2a3a':'transparent',borderLeft:selectedConv?.id===c.id?'3px solid #60a5fa':'3px solid transparent'}}>
                    <div style={{fontSize:11,color:'#555',marginBottom:3}}>{c.ts?.slice(0,10)}</div>
                    {c.clinic&&<div style={{fontSize:10,color:'#60a5fa',marginBottom:2}}>{c.clinic}</div>}
                    <div style={{fontSize:13,color:'#aaa',overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>{c.rows[0]?.['user_question']?.slice(0,35)}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:'#1a1d27',borderRadius:12,padding:24,border:'1px solid #2a2d3a',overflow:'auto'}}>
              {!selectedConv?<div style={{color:'#555',textAlign:'center',marginTop:80}}>会話を選択してください</div>:
                <>
                  <div style={{fontSize:12,color:'#555',marginBottom:16}}>{selectedConv.ts} {selectedConv.clinic&&`| ${selectedConv.clinic}`}</div>
                  {selectedConv.rows.map((r,i)=>(
                    <div key={i}>
                      {r['user_question']&&<div style={{display:'flex',justifyContent:'flex-end',marginBottom:10}}><div style={{background:'#2563a8',color:'white',borderRadius:'12px 12px 2px 12px',padding:'8px 14px',maxWidth:'70%',fontSize:14,lineHeight:1.6}}>{r['user_question']}</div></div>}
                      {r['ai_answer']&&<div style={{display:'flex',marginBottom:14}}><div style={{background:'#1e2030',color:'#ddd',borderRadius:'12px 12px 12px 2px',padding:'8px 14px',maxWidth:'70%',fontSize:14,lineHeight:1.6,border:'1px solid #2a2d3a'}}>{r['ai_answer']}</div></div>}
                    </div>
                  ))}
                </>
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export async function getServerSideProps({params}){return{props:{clientId:params.client}};}