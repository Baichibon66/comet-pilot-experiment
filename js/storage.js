(function(root){'use strict';
const conf=()=>root.COMET_CONFIG;
async function save(payload){const c=conf();if(c.storageMode==='local')return {ok:false,mode:'local',detail:'No remote endpoint configured'};
 try{
  let url,headers={'Content-Type':'application/json'},body;
  if(c.storageMode==='supabase'){
   if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(c.supabaseUrl)||c.supabasePublishableKey.startsWith('YOUR_'))throw Error('Supabase configuration missing');
   url=c.supabaseUrl+'/rest/v1/comet_submissions';headers.apikey=c.supabasePublishableKey;
   // Backward compatible with legacy anon key; publishable keys work with apikey.
   if(c.supabasePublishableKey.startsWith('eyJ'))headers.Authorization='Bearer '+c.supabasePublishableKey;
   headers.Prefer='return=minimal';body=JSON.stringify({session_id:payload.session_id,experiment_version:payload.version,lang:payload.language,complete:payload.complete,payload});
  }else if(c.storageMode==='php'){url=c.phpEndpoint;body=JSON.stringify(payload)}
  else throw Error('Unknown storage mode');
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),18000);
  let response;try{response=await fetch(url,{method:'POST',headers,body,signal:controller.signal,cache:'no-store'})}finally{clearTimeout(timeout)}
  if(!response.ok)throw Error('HTTP '+response.status+' '+(await response.text()).slice(0,200));
  return {ok:true,mode:c.storageMode};
 }catch(error){return {ok:false,mode:c.storageMode,detail:String(error.message||error)};}}
function exportJson(payload){const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'});download(blob,'comet_'+payload.session_id+'.json');}
function toCsv(rows){if(!rows.length)return '';const cols=[...new Set(rows.flatMap(r=>Object.keys(r)))];const esc=v=>{if(v===undefined||v===null)return '';if(typeof v==='object')v=JSON.stringify(v);const x=String(v);return /[",\n\r]/.test(x)?'"'+x.replaceAll('"','""')+'"':x;};return [cols.join(','),...rows.map(r=>cols.map(k=>esc(r[k])).join(','))].join('\r\n');}
function exportCsv(rows,sid){download(new Blob(['\ufeff'+toCsv(rows)],{type:'text/csv;charset=utf-8'}),'comet_'+sid+'.csv');}
function download(blob,name){const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2000);}
root.CometStorage={save,exportJson,exportCsv,toCsv};
})(typeof window==='undefined'?globalThis:window);
