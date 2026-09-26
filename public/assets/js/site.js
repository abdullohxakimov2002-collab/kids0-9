/* =======================================================================
   Kids 0-9 — asosiy sayt dvijogi (UZ va RU uchun UMUMIY kod).
   Sahifa tartibi:  config.js  →  i18n/<til>.js  →  site.js
   - config.js      : CONFIG, LANGS, PRODUCTS (tilga bog'liq bo'lmagan ma'lumot)
   - i18n/<til>.js  : window.LANG = { code, t: {...matnlar}, products, pharmacies, quiz }
   - site.js (shu)  : router, savat, test, barcha sahifa ko'rinishlari, SEO teglar
   Matn qo'shish/o'zgartirish — faqat i18n fayllarda. Bu faylda til matni YO'Q.
   Bu faylni o'zgartirsangiz, HTML'dagi ?v= versiyasini oshiring.
   ======================================================================= */
(function(){
'use strict';

var L = window.LANG, T = L.t;
var BASE = '';
LANGS.forEach(function(x){ if(x.code===L.code) BASE=x.base; });

/* Mahsulotlar: config.js'dagi umumiy maydonlar + tilga xos matnlar */
var P = PRODUCTS.map(function(b){
  var tx = L.products[b.slug] || {}, p = {}, k;
  for(k in b) p[k]=b[k];
  for(k in tx) p[k]=tx[k];
  return p;
});

var V=document.getElementById('view'), NAV=document.getElementById('nav');
var CART_KEY='kids09_cart';   // ikkala til uchun bitta savat
var cart={}, quiz={i:0,score:0,answered:false,picked:-1}, filter='all', city='all';

/* ---------- yordamchilar ---------- */
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function store(k,v){ try{ if(v===undefined) return JSON.parse(localStorage.getItem(k)||'null'); localStorage.setItem(k,JSON.stringify(v)); }catch(e){ return null; } }
function u(path){ return BASE+(path==='/'&&BASE?'/':path); }          // tilga mos havola: u('/mahsulotlar')
var TXT={yellow:{tile:'#4A3800',ink:'#8A6800'},lilac:{tile:'#382a52',ink:'#7A62AE'},green:{tile:'#fff',ink:'#5E9B2C'}};
function ct(c){ return (TXT[c]&&TXT[c].ink)||'var(--'+c+')'; }
function tt(c){ return (TXT[c]&&TXT[c].tile)||'#fff'; }
function bySlug(s){ for(var i=0;i<P.length;i++) if(P[i].slug===s) return P[i]; return null; }
function cartCount(){ var n=0; for(var k in cart) n+=cart[k]; return n; }
function saveCart(){ store(CART_KEY,cart); }
function toast(m){ var t=document.createElement('div'); t.className='toast'; t.textContent=m; document.body.appendChild(t); setTimeout(function(){ if(t.parentNode)t.parentNode.removeChild(t); },2400); }
function addToCart(slug,q){ var p=bySlug(slug); if(!p) return; cart[slug]=(cart[slug]||0)+(q||1); saveCart(); paintNav(); toast(p.name+' '+T.addedToCart); }
function setQty(slug,q){ if(q<=0) delete cart[slug]; else cart[slug]=q; saveCart(); paintNav(); render(); }
function tel(ph){ return 'tel:'+String(ph).replace(/\s/g,''); }
function cards(list,size){
  return list.map(function(c){ return '<div class="card" style="--accent:var(--'+c[1]+')"><h3 style="font-size:'+size+'px;margin-bottom:8px;color:var(--'+c[1]+')">'+c[0]+'</h3><p style="font-size:14px;margin:0">'+c[2]+'</p></div>'; }).join('');
}

/* ---------- joriy marshrut ---------- */
function routePath(){                                   // '/ru/mahsulot/sinus' → 'mahsulot/sinus'
  var p=location.pathname;
  if(BASE && p.indexOf(BASE)===0) p=p.slice(BASE.length);
  return p.replace(/^\/+|\/+$/g,'');
}

/* ---------- header / footer ---------- */
function paintNav(){
  var h='/'+routePath(), n=cartCount();
  var links=[['/mahsulotlar',T.nav.catalog],['/qayerdan-olish',T.nav.where],['/farmatsevtlarga',T.nav.pharm],['/kompaniya',T.nav.company],['/aloqa',T.nav.contact]];
  NAV.innerHTML = links.map(function(l){
      var on = h===l[0] || (l[0]==='/mahsulotlar' && h.indexOf('/mahsulot/')===0);
      return '<a href="'+u(l[0])+'" class="'+(on?'on':'')+'">'+l[1]+'</a>';
    }).join('')+
    '<a href="'+u('/buyurtma')+'" class="cart-btn">'+T.nav.cart+(n?' <b>'+n+'</b>':'')+'</a>';
  var fc=document.getElementById('foot-contact');
  if(fc) fc.innerHTML =
    '<p class="note" style="margin-top:10px;line-height:2"><a href="'+tel(CONFIG.phone)+'">'+esc(CONFIG.phone)+'</a><br><a href="mailto:'+esc(CONFIG.email)+'">'+esc(CONFIG.email)+'</a><br><a href="https://t.me/'+esc(CONFIG.telegram)+'">t.me/'+esc(CONFIG.telegram)+'</a></p>';
  // til almashtirgich: shu sahifaning boshqa tildagi manziliga olib boradi
  var rp=routePath();
  Array.prototype.forEach.call(document.querySelectorAll('[data-lang-link]'),function(a){
    var code=a.getAttribute('data-lang-link'), b='';
    LANGS.forEach(function(x){ if(x.code===code) b=x.base; });
    a.setAttribute('href', rp ? b+'/'+rp : (b?b+'/':'/'));
    a.className = code===L.code?'on':'';
  });
}
document.getElementById('burger').onclick=function(){ NAV.classList.toggle('open'); };

/* ---------- SEO: har bir sahifa uchun title, description, canonical, hreflang ---------- */
function headTag(sel,tag,attrs){
  var el=document.head.querySelector(sel);
  if(!el){ el=document.createElement(tag); document.head.appendChild(el); }
  for(var k in attrs) el.setAttribute(k,attrs[k]);
  return el;
}
function setHead(meta,notFound){
  document.title=meta[0];
  headTag('meta[name="description"]','meta',{name:'description',content:meta[1]});
  var rp=routePath(), origin=location.origin;
  function href(b){ return origin+(rp ? b+'/'+rp : (b?b+'/':'/')); }
  headTag('link[rel="canonical"]','link',{rel:'canonical',href:href(BASE)});
  LANGS.forEach(function(x){ headTag('link[rel="alternate"][hreflang="'+x.code+'"]','link',{rel:'alternate',hreflang:x.code,href:href(x.base)}); });
  headTag('link[rel="alternate"][hreflang="x-default"]','link',{rel:'alternate',hreflang:'x-default',href:href(LANGS[0].base)});
  var r=document.head.querySelector('meta[name="robots"]');
  if(notFound) headTag('meta[name="robots"]','meta',{name:'robots',content:'noindex'});
  else if(r) r.parentNode.removeChild(r);
}

/* ---------- umumiy bloklar ---------- */
function pcard(p){
  return '<article class="pcard" style="--c:var(--'+p.color+');--ct:'+ct(p.color)+';--btxt:'+tt(p.color)+'">'+
    '<div class="pshot">'+(p.img?'<img src="'+esc(p.img)+'" alt="'+esc(T.alt(p))+'" loading="lazy">':'<span class="ph">0-9</span>')+'</div>'+
    '<div><h3>'+esc(p.name)+'</h3><p class="sub">'+esc(p.sub)+'</p></div>'+
    '<p class="desc">'+esc(p.desc)+'</p>'+
    '<div class="tagrow">'+p.tags.map(function(t){return '<span class="tag c">'+esc(t)+'</span>';}).join('')+'</div>'+
    '<p class="chip-form">'+esc(p.form)+' · '+esc(p.vol)+' · '+esc(T.flavor(p.flavor))+'</p>'+
    '<div class="pcard-foot"><a class="btn" href="'+u('/mahsulot/'+p.slug)+'">'+T.more+'</a>'+
    '<button class="btn-ghost btn-sm" data-add="'+p.slug+'">'+T.toCart+'</button></div></article>';
}
function safetyStrip(){
  return '<div class="wrap"><div class="warnbox" style="margin:0 0 8px">'+T.safetyStrip+'</div></div>';
}
function secHead(eyebrow,title,text){
  return '<div class="sec-head">'+(eyebrow?'<div class="eyebrow">'+eyebrow+'</div>':'')+'<h2>'+title+'</h2>'+(text?'<p>'+text+'</p>':'')+'</div>';
}

/* ---------- BOSH SAHIFA ---------- */
function vHome(){
  var H=T.home;
  return '<section class="hero"><div class="wrap hero-in">'+
   '<div><div class="eyebrow">'+H.eyebrow+'</div>'+
   '<h1>'+H.h1+'</h1>'+
   '<p class="lead">'+H.lead+'</p>'+
   '<div class="hero-cta"><a class="btn" href="'+u('/mahsulotlar')+'">'+H.ctaCatalog+'</a>'+
   '<a class="btn-ghost" href="'+u('/qayerdan-olish')+'">'+H.ctaWhere+'</a></div>'+
   '<div class="hero-facts">'+H.facts.map(function(f){ return '<span>'+f+'</span>'; }).join('')+'</div></div>'+
   '<div class="boxwall">'+P.slice(0,9).map(function(p){
      return '<a href="'+u('/mahsulot/'+p.slug)+'" style="--c:var(--'+p.color+');color:'+tt(p.color)+'">'+
        (p.img?'<img src="'+esc(p.img)+'" alt="'+esc(T.alt(p))+'" loading="lazy">':'<span class="bw-09">0-9</span>')+
        '<span class="bw-txt"><span class="bw-n">'+esc(p.name)+'</span><br><span class="bw-s">'+esc(p.sub)+'</span></span></a>';
   }).join('')+'</div>'+
   '</div></section>'+

   '<section class="sec"><div class="wrap">'+secHead(H.whyEyebrow,H.whyTitle,H.whyText)+
   '<div class="grid g4">'+cards(H.why,19)+'</div></div></section>'+

   '<section class="sec" style="padding-top:0"><div class="wrap">'+secHead(H.lineEyebrow,H.lineTitle,H.lineText)+
   '<div class="grid g3">'+P.slice(0,6).map(pcard).join('')+'</div>'+
   '<p style="margin-top:20px"><a class="btn-ghost" href="'+u('/mahsulotlar')+'">'+H.allProducts(P.length)+'</a></p>'+
   '</div></section>'+

   safetyStrip()+

   '<section class="sec"><div class="wrap"><div class="panel" style="display:grid;gap:18px;align-items:center">'+
   '<div><div class="eyebrow">'+H.pharmEyebrow+'</div><h2 style="font-size:26px;margin:6px 0 8px">'+H.pharmTitle+'</h2>'+
   '<p class="muted" style="font-weight:600;max-width:620px">'+H.pharmText+'</p>'+
   '<a class="btn" href="'+u('/farmatsevtlarga')+'">'+H.pharmCta+'</a></div>'+
   '</div></div></section>';
}

/* ---------- KATALOG ---------- */
function vCatalog(){
  var C=T.catalog;
  var list = filter==='all' ? P : P.filter(function(p){ return (p.cats||[]).indexOf(filter)>-1; });
  return '<section class="sec"><div class="wrap">'+secHead(C.eyebrow,C.title,C.text)+
   '<div class="filters"><button class="chip '+(filter==='all'?'on':'')+'" data-f="all">'+C.all+'</button>'+
   T.cats.map(function(t){ return '<button class="chip '+(filter===t[0]?'on':'')+'" data-f="'+t[0]+'">'+esc(t[1])+'</button>'; }).join('')+'</div>'+
   (list.length? '<div class="grid g3">'+list.map(pcard).join('')+'</div>' : '<p class="empty">'+C.empty+'</p>')+
   '</div></section>'+safetyStrip()+'<div style="height:40px"></div>';
}

/* ---------- MAHSULOT SAHIFASI ---------- */
function vProduct(p){
  var R=T.product, c='var(--'+p.color+')';
  return '<div style="--accent:'+c+';--accent-ink:'+ct(p.color)+';--accent-soft:color-mix(in srgb,'+c+' 14%,#fff)">'+
   '<section class="phero"><div class="wrap phero-grid">'+
   '<div><p class="crumb"><a href="'+u('/mahsulotlar')+'">'+T.nav.catalog+'</a> › '+esc(p.name)+'</p>'+
   '<h1>'+esc(p.name)+'</h1><p class="lead">'+esc(p.lead)+'</p>'+
   '<div class="pmeta"><span>'+esc(p.form)+'</span><span>'+esc(p.vol)+'</span><span>'+esc(T.flavor(p.flavor))+'</span><span>'+esc(p.age)+'</span></div>'+
   '<div class="hero-cta"><button class="btn" style="color:'+tt(p.color)+'" data-add="'+p.slug+'">'+R.addToCart+'</button>'+
   '<a class="btn-ghost" href="'+u('/qayerdan-olish')+'">'+T.nav.where+'</a></div>'+
   '<p class="note" style="margin-top:14px">'+R.official+' <a href="'+esc(p.src)+'" target="_blank" rel="noopener">homeocan.ca ↗</a></p></div>'+
   '<div class="phero-shot">'+(p.img?'<img src="'+esc(p.img)+'" alt="'+esc(T.alt(p))+'">':'<span class="ph">0-9</span>')+'</div>'+
   '</div></section>'+

   '<section class="sec"><div class="wrap"><div class="grid g2">'+
   '<div><div class="panel"><div class="eyebrow">'+R.comp(p.comp.length)+'</div>'+
   '<table style="margin-top:12px"><tbody>'+p.comp.map(function(r){
      return '<tr><td>'+esc(r[0])+'<em>'+esc(r[1])+'</em></td><td class="muted" style="font-weight:600">'+esc(r[2])+'</td></tr>';
   }).join('')+'</tbody></table></div></div>'+

   '<div><div class="dose"><b>'+R.dose+'</b>'+p.dose.map(function(d){return '<p style="margin:0 0 6px">'+esc(d)+'</p>';}).join('')+
   '<p class="note" style="margin-top:8px">'+R.doseNote+'</p></div>'+
   '<div class="panel" style="margin-top:16px"><div class="eyebrow">'+R.about+'</div><p style="margin-top:10px">'+esc(p.about)+'</p>'+
   '<p style="margin:0"><b>'+R.vs+'</b> '+esc(p.vs)+'</p></div>'+
   (p.warn?'<div class="warnbox" style="margin-top:16px"><b>'+R.warn+'</b> '+esc(p.warn)+'</div>':'')+
   '<p class="note" style="margin-top:14px">'+R.note+'</p>'+
   '</div></div></div></section>'+

   '<section class="sec" style="padding-top:0"><div class="wrap"><div class="sec-head"><h2 style="font-size:24px">'+R.others+'</h2></div>'+
   '<div class="grid g3">'+P.filter(function(x){return x.slug!==p.slug;}).slice(0,3).map(pcard).join('')+'</div></div></section>'+
   '</div>';
}

/* ---------- QAYERDAN OLISH ---------- */
function vWhere(){
  var W=T.where, PH=L.pharmacies, cities={};
  PH.forEach(function(x){cities[x.city]=1;});
  var list = city==='all'?PH:PH.filter(function(x){return x.city===city;});
  return '<section class="sec"><div class="wrap">'+secHead(W.eyebrow,W.title,W.text)+
   '<div class="filters"><button class="chip '+(city==='all'?'on':'')+'" data-city="all">'+W.allCities+'</button>'+
   Object.keys(cities).map(function(c){return '<button class="chip '+(city===c?'on':'')+'" data-city="'+esc(c)+'">'+esc(c)+'</button>';}).join('')+'</div>'+
   '<div class="ph-list">'+list.map(function(x){
     return '<div class="ph-item"><div><h4>'+esc(x.name)+'</h4><p>'+esc(x.city)+' · '+esc(x.addr)+'</p></div>'+
       '<a class="btn-ghost btn-sm" href="'+esc(tel(x.phone))+'">'+esc(x.phone)+'</a></div>';
   }).join('')+'</div>'+
   '<div class="tint" style="margin-top:22px"><b>'+W.missTitle+'</b><p style="margin:6px 0 12px" class="muted">'+W.missText+'</p>'+
   '<a class="btn" href="'+u('/buyurtma')+'">'+W.order+'</a></div>'+
   '</div></section>';
}

/* ---------- BUYURTMA ---------- */
function vOrder(){
  var O=T.order, keys=Object.keys(cart).filter(bySlug);
  var rows = keys.length? keys.map(function(k){
    var p=bySlug(k);
    return '<div class="cart-row"><span class="cart-dot" style="--c:var(--'+p.color+')">0-9</span>'+
      '<span class="cart-name">'+esc(p.name)+'<em>'+esc(p.form)+' · '+esc(p.vol)+'</em></span>'+
      '<span class="qty"><button data-q="'+k+'|-1" aria-label="−1">−</button><span>'+cart[k]+'</span><button data-q="'+k+'|1" aria-label="+1">+</button></span>'+
      '<button class="btn-ghost btn-sm" data-q="'+k+'|0">'+O.remove+'</button></div>';
  }).join('') : '<p class="empty">'+O.empty+' <a href="'+u('/mahsulotlar')+'">'+O.emptyLink+'</a></p>';

  return '<section class="sec"><div class="wrap">'+secHead(O.eyebrow,O.title,O.text)+
   '<div class="grid g2" style="align-items:start">'+
   '<div class="panel">'+rows+
   (keys.length?'<p class="hint" style="margin-top:14px"><a href="'+u('/mahsulotlar')+'">'+O.addMore+'</a></p>':'')+'</div>'+
   '<div class="panel">'+
   '<div class="row2"><div class="field"><label for="o-name">'+O.f.name+'</label><input id="o-name" placeholder="'+esc(O.ph.name)+'"></div>'+
   '<div class="field"><label for="o-phone">'+O.f.phone+'</label><input id="o-phone" type="tel" placeholder="+998 90 123 45 67"></div></div>'+
   '<div class="row2"><div class="field"><label for="o-city">'+O.f.city+'</label><input id="o-city" value="'+esc(T.city)+'"></div>'+
   '<div class="field"><label for="o-type">'+O.f.type+'</label><select id="o-type">'+O.types.map(function(x){return '<option>'+esc(x)+'</option>';}).join('')+'</select></div></div>'+
   '<div class="field"><label for="o-addr">'+O.f.addr+'</label><input id="o-addr" placeholder="'+esc(O.ph.addr)+'"></div>'+
   '<div class="field"><label for="o-note">'+O.f.note+'</label><textarea id="o-note" rows="3" placeholder="'+esc(O.ph.note)+'"></textarea></div>'+
   '<button class="btn btn-block" data-act="send-tg">'+O.sendTg+'</button>'+
   '<div style="height:8px"></div>'+
   '<div class="row2"><button class="btn-ghost btn-block" data-act="send-wa">WhatsApp</button>'+
   '<button class="btn-ghost btn-block" data-act="copy">'+O.copy+'</button></div>'+
   '<p class="hint">'+O.hint+'</p>'+
   '</div></div></div></section>';
}
function orderText(){
  var O=T.order, keys=Object.keys(cart).filter(bySlug), v=function(id){ var e=document.getElementById(id); return e?e.value.trim():''; };
  var t=O.msgTitle+'\n\n';
  t+= keys.length? keys.map(function(k){ var p=bySlug(k); return '• '+p.name+' ('+p.vol+') × '+cart[k]; }).join('\n') : O.msgNone;
  t+='\n\n'+O.f.name+': '+(v('o-name')||'—')+'\n'+O.f.phone+': '+(v('o-phone')||'—')+'\n'+O.f.city+': '+(v('o-city')||'—')+
     '\n'+O.f.type+': '+(v('o-type')||'—')+'\n'+O.f.addr+': '+(v('o-addr')||'—')+'\n'+O.f.note+': '+(v('o-note')||'—');
  return t;
}

/* ---------- FARMATSEVTLARGA ---------- */
function vPharm(){
  var F=T.pharm, Q=L.quiz, body;
  if(quiz.i>=Q.length){
    var pc=Math.round(quiz.score/Q.length*100);
    body='<div class="center"><div class="score-big '+(pc<70?'low':'')+'">'+pc+'%</div>'+
      '<p style="font-weight:800">'+quiz.score+' / '+Q.length+' '+F.correct+'</p>'+
      '<p class="muted" style="font-weight:600">'+(pc>=70?F.good:F.bad)+'</p>'+
      '<div class="hero-cta" style="justify-content:center"><button class="btn" data-act="quiz-restart">'+F.restart+'</button>'+
      '<a class="btn-ghost" href="'+esc(CONFIG.marathonUrl)+'">'+F.marathon+'</a></div></div>';
  } else {
    var q=Q[quiz.i];
    body='<div class="pill-row">'+Q.map(function(_,i){ return '<span class="pill '+(i<quiz.i?'done':(i===quiz.i?'now':''))+'"></span>'; }).join('')+'</div>'+
      '<div class="eyebrow">'+F.q+' '+(quiz.i+1)+' / '+Q.length+'</div>'+
      '<h3 style="font-size:22px;margin:8px 0 18px">'+esc(q.q)+'</h3>'+
      q.o.map(function(o,i){
        var cls=''; if(quiz.answered){ if(i===q.a) cls=' ok'; else if(i===quiz.picked) cls=' bad'; }
        return '<button class="opt'+cls+'" data-opt="'+i+'"><span class="key">'+'ABCD'[i]+'</span>'+esc(o)+'</button>';
      }).join('')+
      (quiz.answered? '<div class="tint" style="margin-top:6px"><b>'+F.why+'</b> '+esc(q.why)+'</div>'+
        '<button class="btn btn-block" style="margin-top:14px" data-act="quiz-next">'+(quiz.i===Q.length-1?F.result:F.next)+'</button>' : '');
  }
  return '<section class="sec"><div class="wrap">'+secHead(F.eyebrow,F.title,F.text)+
   '<div class="grid g2"><div class="panel">'+body+'</div>'+
   '<div><div class="card"><h3 style="font-size:19px;margin-bottom:10px">'+F.tipsTitle+'</h3>'+
   F.tips.map(function(x,i){ return '<p style="font-size:14.5px'+(i===F.tips.length-1?';margin:0':'')+'">'+x+'</p>'; }).join('')+'</div>'+
   '<div class="card" style="--accent:var(--orange);margin-top:16px"><h3 style="font-size:19px;margin-bottom:10px;color:var(--orange)">'+F.mTitle+'</h3>'+
   '<p style="font-size:14.5px">'+F.mText+'</p>'+
   '<a class="btn" style="background:var(--orange)" href="'+esc(CONFIG.marathonUrl)+'">'+F.mCta+'</a></div></div>'+
   '</div></div></section>';
}

/* ---------- KOMPANIYA / XAVFSIZLIK / ALOQA ---------- */
function vCompany(){
  var C=T.company;
  return '<section class="sec"><div class="wrap">'+secHead(C.eyebrow,C.title,C.text)+
   '<div class="grid g4">'+cards(C.cards,18)+'</div>'+
   '<div class="grid g2" style="margin-top:22px;align-items:start">'+
   '<div class="panel"><h3 style="font-size:20px;margin-bottom:10px">'+C.lineTitle+'</h3>'+
   '<p class="muted" style="font-weight:600">'+C.lineText(P.length)+'</p>'+
   '<a class="btn-ghost" href="https://homeocan.ca/en/collections/kids-0-9" target="_blank" rel="noopener">'+C.catalogLink+'</a></div>'+
   '<div class="panel"><h3 style="font-size:20px;margin-bottom:10px">'+C.makerTitle+'</h3>'+
   '<p style="margin:0 0 4px"><b>Homeocan Inc.</b></p>'+
   '<p class="muted" style="font-weight:600;margin:0 0 4px">'+C.address+'</p>'+
   '<p class="muted" style="font-weight:600;margin:0 0 10px">'+C.tel+': (514) 256-6303 · serviceclient@homeocan.ca</p>'+
   '<p style="margin:0"><a href="https://homeocan.ca/en" target="_blank" rel="noopener">homeocan.ca ↗</a> · '+
   '<a href="https://www.instagram.com/homeocan_inc/" target="_blank" rel="noopener">Instagram</a> · '+
   '<a href="https://www.facebook.com/homeocan" target="_blank" rel="noopener">Facebook</a> · '+
   '<a href="https://www.youtube.com/@Homeocan-canada" target="_blank" rel="noopener">YouTube</a></p></div></div>'+
   '</div></section>';
}
function vSafety(){
  var S=T.safety;
  return '<section class="sec"><div class="wrap" style="max-width:820px">'+secHead(S.eyebrow,S.title,'')+
   '<div class="panel">'+S.blocks.map(function(b,i){
     return '<h3 style="font-size:19px;margin:'+(i?'18px':'0')+' 0 8px">'+b[0]+'</h3><p class="muted" style="font-weight:600">'+b[1]+'</p>';
   }).join('')+'</div>'+
   '<div class="warnbox" style="margin-top:16px">'+S.warn+'</div>'+
   '</div></section>';
}
function vContact(){
  var C=T.contact;
  return '<section class="sec"><div class="wrap">'+secHead(C.eyebrow,C.title,C.text)+
   '<div class="grid g2"><div class="panel">'+
   '<p><b>'+C.phone+':</b> <a href="'+tel(CONFIG.phone)+'">'+esc(CONFIG.phone)+'</a></p>'+
   '<p><b>Telegram:</b> <a href="https://t.me/'+esc(CONFIG.telegram)+'">@'+esc(CONFIG.telegram)+'</a></p>'+
   '<p><b>'+C.email+':</b> <a href="mailto:'+esc(CONFIG.email)+'">'+esc(CONFIG.email)+'</a></p>'+
   '<p style="margin:0"><b>'+C.city+':</b> '+esc(T.city)+'</p></div>'+
   '<div>'+C.faq.map(function(f,i){ return '<details'+(i?'':' open')+'><summary>'+f[0]+'</summary><p>'+f[1]+'</p></details>'; }).join('')+'</div>'+
   '</div></div></section>';
}
function vNotFound(text,linkHref,linkText){
  return '<section class="sec"><div class="wrap"><p class="empty">'+text+' <a href="'+linkHref+'">'+linkText+'</a></p></div></section>';
}

/* ---------- ROUTER ---------- */
var ROUTES={
  '':               function(){ return [vHome(),T.meta.home]; },
  'mahsulotlar':    function(){ return [vCatalog(),T.meta.catalog]; },
  'qayerdan-olish': function(){ return [vWhere(),T.meta.where]; },
  'buyurtma':       function(){ return [vOrder(),T.meta.order]; },
  'farmatsevtlarga':function(){ return [vPharm(),T.meta.pharm]; },
  'kompaniya':      function(){ return [vCompany(),T.meta.company]; },
  'xavfsizlik':     function(){ return [vSafety(),T.meta.safety]; },
  'aloqa':          function(){ return [vContact(),T.meta.contact]; }
};
function known(rp){                                    // marshrut mavjudmi (chizmasdan tekshiradi)
  var part=rp.split('/');
  if(part[0]==='mahsulot') return part.length===2 && !!bySlug(part[1]);
  return part.length===1 && ROUTES.hasOwnProperty(part[0]);
}
function resolve(rp){                                  // [html, [title, description]] yoki null (404)
  if(!known(rp)) return null;
  var part=rp.split('/');
  if(part[0]==='mahsulot'){ var p=bySlug(part[1]); return [vProduct(p),T.meta.product(p)]; }
  return ROUTES[part[0]]();
}
function render(){
  var r=resolve(routePath());
  if(r){ V.innerHTML=r[0]; setHead(r[1],false); }
  else { V.innerHTML=vNotFound(T.notFound,u('/'),T.toHome); setHead(T.meta.notFound,true); }
  paintNav(); NAV.classList.remove('open');
}
function isAppRoute(href){
  if(!href || href.charAt(0)!=='/') return false;
  function under(b){ return href===b || href.indexOf(b+'/')===0; }
  var other=LANGS.some(function(x){ return x.base && x.base!==BASE && under(x.base); });
  if(other) return false;                                // boshqa til — to'liq sahifa yuklanadi
  if(BASE){ if(!under(BASE)) return false; href=href.slice(BASE.length); }
  return known(href.replace(/^\/+|\/+$/g,''));
}
function go(href){
  if(location.pathname!==href) history.pushState(null,'',href);
  window.scrollTo(0,0); render();
}
window.addEventListener('popstate',function(){ window.scrollTo(0,0); render(); });

/* ---------- HODISALAR ---------- */
document.addEventListener('click',function(e){
  var a=e.target.closest('a[href]');
  if(a){
    var href=a.getAttribute('href');
    if(a.hasAttribute('data-lang-link')) return;                   // til almashtirish — to'liq sahifa yuklanadi
    if(!isAppRoute(href) || a.target==='_blank'||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0) return;
    e.preventDefault(); go(href); return;
  }
  var t=e.target.closest('[data-add],[data-f],[data-city],[data-q],[data-opt],[data-act]');
  if(!t) return;
  if(t.dataset.add){ addToCart(t.dataset.add,1); return; }
  if(t.dataset.f){ filter=t.dataset.f; render(); return; }
  if(t.dataset.city){ city=t.dataset.city; render(); return; }
  if(t.dataset.q){ var s=t.dataset.q.split('|'); var d=parseInt(s[1],10);
    setQty(s[0], d===0?0:(cart[s[0]]||0)+d); return; }
  if(t.dataset.opt!==undefined && t.dataset.opt!==''){
    if(quiz.answered) return;
    quiz.picked=parseInt(t.dataset.opt,10); quiz.answered=true;
    if(quiz.picked===L.quiz[quiz.i].a) quiz.score++;
    render(); return;
  }
  var act=t.dataset.act, O=T.order;
  if(act==='quiz-next'){ quiz.i++; quiz.answered=false; quiz.picked=-1; render(); }
  else if(act==='quiz-restart'){ quiz={i:0,score:0,answered:false,picked:-1}; render(); }
  else if(act==='send-tg'){ window.open('https://t.me/'+CONFIG.telegram+'?text='+encodeURIComponent(orderText()),'_blank'); }
  else if(act==='send-wa'){ window.open('https://wa.me/'+CONFIG.whatsapp+'?text='+encodeURIComponent(orderText()),'_blank'); }
  else if(act==='copy'){
    var txt=orderText();
    if(navigator.clipboard) navigator.clipboard.writeText(txt).then(function(){toast(O.copied);},function(){toast(O.copyFail);});
    else toast(O.copyNA);
  }
});

/* ---------- ISHGA TUSHIRISH ---------- */
var saved=store(CART_KEY);
if(!saved) saved=store('kids09_cart_ru');            // eski RU savatini ko'chirish (2026-09 gacha alohida edi)
if(saved && typeof saved==='object') cart=saved;
render();
})();
