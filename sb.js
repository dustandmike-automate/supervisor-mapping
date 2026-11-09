// Supabase adapter: same db API the map used inside claude.ai (collection/doc, onSnapshot, set/update/delete).
(function(){
const URL='https://uuxpcoxeycjmfvxdphco.supabase.co',KEY='sb_publishable_Av5np2-eDvF9K_UZWpKGBw_fspLEsMm';
const sb=supabase.createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true}});
const cache={};
const C=c=>cache[c]||(cache[c]=new Map());
const snapColl=c=>({docs:[...C(c)].map(([id,d])=>({id,data:()=>d}))});
function listen(c,emit,onErr){
  let live=true;
  sb.from('docs').select('id,data').eq('coll',c).then(({data,error})=>{if(error){onErr&&onErr(error);return;}const m=C(c);m.clear();data.forEach(r=>m.set(r.id,r.data));live&&emit();});
  sb.channel('docs-'+c+'-'+Math.random().toString(36).slice(2)).on('postgres_changes',{event:'*',schema:'public',table:'docs',filter:'coll=eq.'+c},p=>{
    const m=C(c);if(p.eventType==='DELETE')m.delete((p.old||{}).id);else m.set(p.new.id,p.new.data);emit();}).subscribe();
  return()=>{live=false;};
}
const split=p=>{const i=p.lastIndexOf('/');return[p.slice(0,i),p.slice(i+1)];};
async function write(c,id,data){const{error}=await sb.from('docs').upsert({coll:c,id,data});if(error)throw error;C(c).set(id,data);}
const db={
  collection:c=>({onSnapshot:(cb,err)=>listen(c,()=>cb(snapColl(c)),err)}),
  doc:p=>{const[c,id]=split(p);return{
    onSnapshot:(cb,err)=>listen(c,()=>{const d=C(c).get(id);cb({exists:!!d,data:()=>d});},err),
    set:d=>write(c,id,d),
    update:async patch=>{let cur=C(c).get(id);if(!cur){const r=await sb.from('docs').select('data').eq('coll',c).eq('id',id).maybeSingle();cur=r.data&&r.data.data||{};}return write(c,id,Object.assign({},cur,patch));},
    delete:async()=>{const{error}=await sb.from('docs').delete().eq('coll',c).eq('id',id);if(error)throw error;C(c).delete(id);}
  };},
  upload:async f=>{const ext=(f.name.split('.').pop()||'mp4').toLowerCase().replace(/[^a-z0-9]/g,''),path=Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8)+'.'+ext;
    const{error}=await sb.storage.from('media').upload(path,f,{contentType:f.type||'video/mp4',upsert:false});if(error)throw error;return path;},
  mediaUrl:async path=>{const{data,error}=await sb.storage.from('media').createSignedUrl(path,3600);if(error)throw error;return data.signedUrl;}
};
let ready;const gate=new Promise(r=>ready=r);
window.SBDB=()=>gate;
document.addEventListener('DOMContentLoaded',async()=>{
  const $=id=>document.getElementById(id),msg=t=>$('aMsg').textContent=t;
  const go=()=>{$('auth').hidden=true;$('app').hidden=false;ready(db);};
  const{data:{session}}=await sb.auth.getSession();
  if(session)return go();
  $('auth').hidden=false;
  const creds=()=>({email:$('aEmail').value.trim(),password:$('aPass').value});
  $('aIn').onclick=async()=>{msg('Signing in…');const{error}=await sb.auth.signInWithPassword(creds());error?msg(error.message):go();};
  $('aUp').onclick=async()=>{msg('Creating…');const{error}=await sb.auth.signUp(creds());msg(error?error.message:'Check your email and tap the confirm link, then come back and sign in.');};
});
})();
