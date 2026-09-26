/* Firebase compat SDK'ning juda kichik soxta (mock) versiyasi — faqat test uchun.
   tools/smoke-test.js uni gstatic.com/firebasejs/* so'rovlari o'rniga beradi.
   Ma'lumotlar localStorage('__mockdb')da saqlanadi, shuning uchun sahifa
   reload qilinganda ham yo'qolmaydi. firestore.rules'dagi asosiy qoidalar
   taqlid qilinadi: meta/* — o'qish hammaga, yozish faqat admin;
   results/* — yaratish hammaga, o'qish/o'zgartirish/o'chirish faqat admin. */
(function(){
  if (window.firebase) return;
  function load(){ try{ return JSON.parse(localStorage.getItem('__mockdb')||'{}'); }catch(e){ return {}; } }
  function save(db){ localStorage.setItem('__mockdb', JSON.stringify(db)); }
  function authed(){ return !!localStorage.getItem('__mockauth'); }
  function deny(){ var e=new Error('Missing or insufficient permissions.'); e.code='permission-denied'; return e; }
  function canRead(col){ return col==='meta' || authed(); }
  function canWrite(col,op){ return authed() || (col==='results' && op==='create'); }
  var n=0; function newId(){ return 'm'+Date.now().toString(36)+(n++); }
  function snap(col,id,data){ return { id:id, exists:data!==undefined, data:function(){ return JSON.parse(JSON.stringify(data)); }, ref:docRef(col,id) }; }
  function docRef(col,id){
    return {
      id:id,
      get:function(){ if(!canRead(col)) return Promise.reject(deny()); var db=load(); return Promise.resolve(snap(col,id,(db[col]||{})[id])); },
      set:function(v){ var db=load(); var exists=!!(db[col]||{})[id]; if(!canWrite(col,exists?'update':'create')) return Promise.reject(deny());
        db[col]=db[col]||{}; db[col][id]=JSON.parse(JSON.stringify(v)); save(db); return Promise.resolve(); },
      update:function(p){ if(!canWrite(col,'update')) return Promise.reject(deny()); var db=load(); var d=(db[col]||{})[id]; if(!d) return Promise.reject(new Error('not-found'));
        for(var k in p) d[k]=p[k]; save(db); return Promise.resolve(); },
      delete:function(){ if(!canWrite(col,'delete')) return Promise.reject(deny()); var db=load(); if(db[col]) delete db[col][id]; save(db); return Promise.resolve(); }
    };
  }
  function colRef(col){
    return {
      doc:function(id){ return docRef(col,id||newId()); },
      add:function(v){ var r=docRef(col,newId()); return r.set(v).then(function(){ return r; }); },
      get:function(){ if(!canRead(col)) return Promise.reject(deny()); var db=load(), m=db[col]||{}, list=Object.keys(m).map(function(id){ return snap(col,id,m[id]); });
        return Promise.resolve({ empty:!list.length, size:list.length, docs:list, forEach:function(f){ list.forEach(f); } }); }
    };
  }
  var fs={ collection:colRef, batch:function(){ var ops=[]; return {
    set:function(r,v){ ops.push(function(){ return r.set(v); }); }, update:function(r,v){ ops.push(function(){ return r.update(v); }); },
    delete:function(r){ ops.push(function(){ return r.delete(); }); },
    commit:function(){ return ops.reduce(function(p,f){ return p.then(f); }, Promise.resolve()); } }; } };
  var cbs=[];
  function fire(){ var u=authed()?{uid:'admin',email:localStorage.getItem('__mockauth')}:null; cbs.forEach(function(cb){ cb(u); }); }
  var au={
    onAuthStateChanged:function(cb){ cbs.push(cb); setTimeout(function(){ cb(authed()?{uid:'admin'}:null); },30); return function(){}; },
    signInWithEmailAndPassword:function(e,p){ if(p!=='admin123') return Promise.reject(new Error('wrong password')); localStorage.setItem('__mockauth',e); setTimeout(fire,10); return Promise.resolve({}); },
    signOut:function(){ localStorage.removeItem('__mockauth'); setTimeout(fire,10); return Promise.resolve(); }
  };
  window.firebase={ initializeApp:function(){ return {}; }, firestore:function(){ return fs; }, auth:function(){ return au; } };
})();
