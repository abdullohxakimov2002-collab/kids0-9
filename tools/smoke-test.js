#!/usr/bin/env node
/* Saytning avtomatik smoke-testi (Playwright + Chromium).
   Ishlatish:  NODE_PATH=/opt/node22/lib/node_modules node tools/smoke-test.js
   - public/ ni tools/serve.js orqali lokal serve qiladi (Firebase rewrites bilan);
   - Google Fonts so'rovlarini bloklaydi, Firebase CDN o'rniga tools/firebase-mock.js beradi;
   - UZ va RU sahifalarning barcha marshrutlarini, savat, test, til almashtirgichni
     va "Bilim marafoni" (login → bosqich → reload → davom → natija → admin) oqimini tekshiradi.
   Hammasi PASS bo'lsa exit code 0, aks holda 1. */
var http = require('http'), fs = require('fs'), path = require('path');
var chromium = require('playwright').chromium;
var handler = require('./serve').handler;
var MOCK = fs.readFileSync(path.join(__dirname, 'firebase-mock.js'), 'utf8');
var EXE = fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined;

var fails = 0, passes = 0;
function check(ok, name, extra){
  if (ok) { passes++; console.log('  PASS  ' + name); }
  else { fails++; console.log('  FAIL  ' + name + (extra ? '  → ' + extra : '')); }
}

async function newPage(browser, base, errors){
  var ctx = await browser.newContext();
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, function(r){ return r.fulfill({ status: 200, body: '' }); });
  await ctx.route(/gstatic\.com\/firebasejs\//, function(r){
    return r.fulfill({ status: 200, contentType: 'text/javascript', body: /firebase-app/.test(r.request().url()) ? MOCK : '' });
  });
  var page = await ctx.newPage();
  page.on('pageerror', function(e){ errors.push(e.message); });
  page.on('dialog', function(d){ d.accept(); });
  page.base = base;
  return page;
}

async function site(browser, base, lang){
  console.log('\n[' + lang.toUpperCase() + '] ' + (base || '/'));
  var errors = [], page = await newPage(browser, 'http://localhost:' + PORT, errors);
  var pre = lang === 'ru' ? '/ru' : '';
  var routes = ['/', '/mahsulotlar', '/mahsulot/sinus', '/qayerdan-olish', '/buyurtma', '/farmatsevtlarga', '/kompaniya', '/xavfsizlik', '/aloqa'];
  var titles = {};
  for (var i = 0; i < routes.length; i++) {
    var url = page.base + pre + (routes[i] === '/' && pre ? '/' : routes[i]);
    var before = errors.length;
    await page.goto(url);
    await page.waitForTimeout(150);
    var info = await page.evaluate(function(){
      var v = document.getElementById('view');
      return { len: v ? v.innerText.length : 0, mode: document.compatMode, title: document.title, lang: document.documentElement.lang };
    });
    titles[routes[i]] = info.title;
    check(errors.length === before && info.len > 80, lang + ' ' + routes[i] + ' ochiladi (JS xatosiz)', errors.slice(before).join(' | ') || ('matn uzunligi ' + info.len));
    if (i === 0) {
      check(info.mode === 'CSS1Compat', lang + ' standards mode (<!DOCTYPE html>)', info.mode);
      check(info.lang === lang, lang + ' <html lang="' + lang + '">', info.lang);
    }
  }
  var uniq = {}; Object.keys(titles).forEach(function(k){ uniq[titles[k]] = 1; });
  check(Object.keys(uniq).length === routes.length, lang + ' har bir sahifaning <title>i alohida', JSON.stringify(titles));

  // 404
  await page.goto(page.base + pre + '/yoq-sahifa-xyz');
  var robots = await page.evaluate(function(){ var m = document.querySelector('meta[name=robots]'); return m ? m.content : ''; });
  check(/noindex/.test(robots), lang + ' 404 sahifada noindex', robots);

  // marafon havolasi
  await page.goto(page.base + pre + '/farmatsevtlarga');
  var mh = await page.evaluate(function(){ return Array.prototype.map.call(document.querySelectorAll('#view a'), function(a){ return a.getAttribute('href'); }).filter(function(h){ return /marafon/i.test(h); }); });
  check(mh.length && mh.every(function(h){ return h === '/bilim-marafoni'; }), lang + ' marafon havolasi /bilim-marafoni', JSON.stringify(mh));

  // nav aktiv holati
  await page.goto(page.base + pre + '/mahsulotlar');
  var on = await page.evaluate(function(){ var a = document.querySelector('#nav a.on'); return a ? a.getAttribute('href') : ''; });
  check(on === pre + '/mahsulotlar', lang + ' menyuda joriy bo\'lim belgilanadi', on);

  // til almashtirgich joriy sahifani saqlaydi
  await page.goto(page.base + pre + '/mahsulot/sinus');
  var sw = await page.evaluate(function(){ return Array.prototype.map.call(document.querySelectorAll('[data-lang-link]'), function(a){ return a.getAttribute('href'); }); });
  check(sw.indexOf('/mahsulot/sinus') > -1 && sw.indexOf('/ru/mahsulot/sinus') > -1, lang + ' til almashtirgich shu sahifaga olib boradi', JSON.stringify(sw));
  var hl = await page.evaluate(function(){ return Array.prototype.map.call(document.querySelectorAll('link[rel=alternate][hreflang]'), function(l){ return l.hreflang + '=' + l.getAttribute('href'); }); });
  check(hl.length === 3, lang + ' hreflang (uz, ru, x-default)', JSON.stringify(hl));
  var canon = await page.evaluate(function(){ var l = document.querySelector('link[rel=canonical]'); return l ? l.getAttribute('href') : ''; });
  check(/\/mahsulot\/sinus$/.test(canon), lang + ' canonical', canon);

  // SPA navigatsiya: menyu havolasi sahifani qayta yuklamasdan ochadi
  await page.goto(page.base + pre + '/');
  await page.evaluate(function(){ window.__spa = 1; });
  await page.click('#nav a[href="' + pre + '/kompaniya"]');
  var spa = await page.evaluate(function(){ return [window.__spa, location.pathname]; });
  check(spa[0] === 1 && spa[1] === pre + '/kompaniya', lang + ' menyu havolasi SPA tarzida ochiladi', JSON.stringify(spa));
  // til almashtirish tugmasi boshqa tildagi xuddi shu sahifani ochadi
  var other = lang === 'uz' ? 'ru' : 'uz';
  await page.click('[data-lang-link="' + other + '"]');
  await page.waitForLoadState('load'); await page.waitForTimeout(150);
  var sw2 = await page.evaluate(function(){ return [document.documentElement.lang, location.pathname]; });
  check(sw2[0] === other && /\/kompaniya$/.test(sw2[1]), lang + ' → ' + other + ' til almashtirish', JSON.stringify(sw2));

  // savat
  await page.goto(page.base + pre + '/mahsulotlar');
  await page.click('[data-add="colic"]');
  await page.click('a.cart-btn');
  await page.waitForTimeout(100);
  var rows = await page.evaluate(function(){ return document.querySelectorAll('.cart-row').length; });
  check(rows === 1, lang + ' savatga qo\'shish va buyurtma sahifasi', 'qatorlar: ' + rows);

  // test
  await page.goto(page.base + pre + '/farmatsevtlarga');
  var qn = await page.evaluate(function(){ return document.querySelectorAll('[data-opt]').length; });
  for (var k = 0; k < 8 && qn; k++) {
    await page.click('[data-opt="0"]');
    await page.click('[data-act="quiz-next"]');
  }
  var score = await page.evaluate(function(){ return !!document.querySelector('.score-big'); });
  check(score, lang + ' farmatsevt testi oxirigacha ishlaydi');

  check(errors.length === 0, lang + ' umumiy: JS xatolari yo\'q', errors.join(' | '));
  await page.context().close();
}

async function marathon(browser){
  console.log('\n[MARAFON] /bilim-marafoni');
  var errors = [], page = await newPage(browser, 'http://localhost:' + PORT, errors);
  var U = page.base + '/bilim-marafoni';
  await page.goto(U);
  await page.waitForSelector('#f-chain');
  check(await page.evaluate(function(){ return document.compatMode; }) === 'CSS1Compat', 'marafon standards mode (<!DOCTYPE html>)');

  // 1) ro'yxatdagi filial bilan kirish
  await page.selectOption('#f-chain', 'c8');
  await page.waitForSelector('#f-branch-sel');
  var opt = await page.evaluate(function(){ return document.querySelector('#f-branch-sel option:nth-child(2)').value; });
  await page.selectOption('#f-branch-sel', opt);
  await page.fill('#f-first', 'Test'); await page.fill('#f-last', 'Farmatsevt');
  await page.click('[data-act="login-me"]');
  await page.click('.stage.open');
  for (var i = 0; i < 3; i++) { await page.click('[data-act="pick"][data-i="0"]'); await page.click('[data-act="next"]'); }
  await page.reload(); await page.waitForSelector('.q-num');
  var qtxt = await page.textContent('.q-num');
  check(/Savol 4 /.test(qtxt), 'reload\'dan keyin test to\'xtagan joyidan davom etadi', qtxt);
  var total = await page.evaluate(function(){ return document.querySelectorAll('.blister .pill').length; });
  for (var j = 3; j < total; j++) {
    await page.click('[data-act="pick"][data-i="1"]');
    if (j < total - 1) await page.click('[data-act="next"]');
  }
  await page.click('[data-act="finish"]');
  await page.waitForSelector('.score-big');
  var te = await page.$('[data-act="toggle-errors"]');
  if (te) { await te.click(); }
  check(!!te && await page.evaluate(function(){ return document.querySelectorAll('.expl, .opt.bad, .opt.ok').length > 0; }), '"Xatolarni ko\'rish" ishlaydi');
  await page.click('[data-act="to-stages"]');
  await page.reload(); await page.waitForSelector('.stage');
  var done = await page.evaluate(function(){ return document.querySelectorAll('.stage.done').length; });
  check(done === 1, 'reload\'dan keyin tugatilgan bosqich "Tugallandi" bo\'lib qoladi', 'done=' + done);
  var bear = await page.evaluate(function(){
    var s = document.querySelector('.stage'); return s ? getComputedStyle(s, '::after').backgroundImage : 'none';
  });
  check(bear === 'none', 'bosqich kartalarida ortiqcha "ayiqcha" rasmi yo\'q', bear.slice(0, 40));

  // 2) admin: kirgandan keyin natijalar ko'rinadi
  await page.click('[data-act="go-admin"]');
  await page.fill('#ad-email', 'admin@test.uz'); await page.fill('#ad-pass', 'admin123');
  await page.click('[data-act="login"]');
  await page.waitForSelector('.tabs');
  await page.click('[data-act="tab"][data-t="results"]');
  await page.waitForTimeout(300);
  var rr = await page.evaluate(function(){ return document.querySelectorAll('[data-act="del-result"]').length; });
  check(rr === 1, 'admin login qilgach natijalar yuklanadi', 'natijalar: ' + rr);
  await page.click('[data-act="admin-logout"]');
  await page.waitForTimeout(100);
  await page.context().close();

  // 3) qo'lda yozilgan filial: reload'dan keyin login saqlanadi
  var errors2 = [], p2 = await newPage(browser, 'http://localhost:' + PORT, errors2);
  await p2.goto(U); await p2.waitForSelector('#f-chain');
  await p2.selectOption('#f-chain', 'c8');
  await p2.selectOption('#f-branch-sel', '__other');
  await p2.fill('#f-branch', 'Yangi filial 77');
  await p2.fill('#f-first', 'Ali'); await p2.fill('#f-last', 'Valiyev');
  await p2.click('[data-act="login-me"]');
  await p2.waitForSelector('.who');
  await p2.reload(); await p2.waitForTimeout(300);
  var who = await p2.evaluate(function(){ var w = document.querySelector('.who'); return w ? w.innerText : ''; });
  check(/Ali Valiyev/.test(who) && /Yangi filial 77/.test(who), 'qo\'lda yozilgan filial bilan kirgan farmatsevt reload\'dan keyin ham tizimda qoladi', who || '(kirish sahifasiga qaytdi)');
  errors = errors.concat(errors2);
  check(errors.length === 0, 'marafon: JS xatolari yo\'q', errors.join(' | '));
  await p2.context().close();
}

/* Brauzersiz statik tekshiruvlar: i18n kalitlari, rasmlar, savollar banki */
function staticChecks(){
  console.log('\n[STATIK]');
  var PUB = path.join(__dirname, '..', 'public');
  function loadLang(code){ var w = {}; new Function('window', fs.readFileSync(path.join(PUB, 'assets/js/i18n/' + code + '.js'), 'utf8'))(w); return w.LANG; }
  function shape(o, p){ var out = []; if (o && typeof o === 'object' && !Array.isArray(o)) Object.keys(o).forEach(function(k){ out.push(p + k); out = out.concat(shape(o[k], p + k + '.')); }); return out; }
  var cfg = {}; new Function('out', fs.readFileSync(path.join(PUB, 'assets/js/config.js'), 'utf8') + ';out.LANGS=LANGS;out.PRODUCTS=PRODUCTS;')(cfg);
  var langs = cfg.LANGS.map(function(l){ return loadLang(l.code); });
  var ref = shape(langs[0].t, 't.').concat(shape(langs[0].products, 'products.'));
  langs.slice(1).forEach(function(L){
    var ks = shape(L.t, 't.').concat(shape(L.products, 'products.'));
    var miss = ref.filter(function(k){ return ks.indexOf(k) < 0; }), extra = ks.filter(function(k){ return ref.indexOf(k) < 0; });
    check(!miss.length && !extra.length, 'i18n: ' + L.code + '.js kalitlari ' + langs[0].code + '.js bilan bir xil', 'yo\'q: ' + miss.join(', ') + ' | ortiqcha: ' + extra.join(', '));
    check(L.quiz.length === langs[0].quiz.length, 'i18n: ' + L.code + ' test savollari soni bir xil');
  });
  cfg.PRODUCTS.forEach(function(p){
    langs.forEach(function(L){ if (!L.products[p.slug]) check(false, 'i18n: ' + L.code + '.js da "' + p.slug + '" mahsulot matni bor'); });
    if (p.img) check(fs.existsSync(path.join(PUB, p.img)), 'rasm mavjud: ' + p.img);
  });
  var w = {}; new Function('window', fs.readFileSync(path.join(PUB, 'bilim-marafoni/bank.js'), 'utf8'))(w);
  var B = w.BANK, ids = {}, bad = [];
  B.questions.forEach(function(q){
    if (ids[q.id]) bad.push(q.id + ' (takror id)'); ids[q.id] = 1;
    if (!B.stages.some(function(s){ return s.id === q.stage; })) bad.push(q.id + ' (bosqich yo\'q: ' + q.stage + ')');
    if (!Array.isArray(q.options) || q.options.length < 2 || !(q.correct >= 0 && q.correct < q.options.length)) bad.push(q.id + ' (variant/correct)');
  });
  B.branches.forEach(function(b){ if (!B.chains.some(function(c){ return c.id === b.chainId; })) bad.push('filial ' + b.id + ' (tarmoq yo\'q)'); });
  check(!bad.length, 'bank.js: ' + B.questions.length + ' savol, ' + B.stages.length + ' bosqich — tuzilishi to\'g\'ri', bad.slice(0, 5).join(', '));
}

var PORT = 8765 + Math.floor(Math.random() * 500);
var server = http.createServer(handler).listen(PORT, async function(){
  var browser = await chromium.launch({ executablePath: EXE });
  try {
    staticChecks();
    await site(browser, '/', 'uz');
    await site(browser, '/ru', 'ru');
    await marathon(browser);
  } catch (e) { fails++; console.log('  FAIL  test to\'xtadi: ' + e.message.split('\n')[0]); }
  await browser.close(); server.close();
  console.log('\n' + passes + ' PASS, ' + fails + ' FAIL');
  process.exit(fails ? 1 : 0);
});
