#!/usr/bin/env node
/* Lokal dev-server: public/ papkani Firebase Hosting kabi serve qiladi.
   firebase.json'dagi "rewrites" qoidalarini o'qiydi — mavjud fayl bo'lsa uni
   beradi, bo'lmasa birinchi mos rewrite manziliga yo'naltiradi.
   Ishlatish:  node tools/serve.js [port]   (default 8080) */
var http = require('http'), fs = require('fs'), path = require('path');
var ROOT = path.join(__dirname, '..');
var cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'firebase.json'), 'utf8')).hosting;
var PUB = path.join(ROOT, cfg.public);
var TYPES = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8',
  '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.json':'application/json', '.txt':'text/plain; charset=utf-8', '.xml':'application/xml' };

function globToRe(g){
  var re = g.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*/g, '\u0000').replace(/\*/g, '[^/]*').replace(/\u0000/g, '.*');
  return new RegExp('^' + re + '$');
}
var RULES = (cfg.rewrites || []).map(function(r){ return { re: globToRe(r.source), dest: r.destination }; });

function fileFor(p){
  var f = path.join(PUB, decodeURIComponent(p));
  if (f.indexOf(PUB) !== 0) return null;
  try {
    var st = fs.statSync(f);
    if (st.isDirectory()) { f = path.join(f, 'index.html'); st = fs.statSync(f); }
    return st.isFile() ? f : null;
  } catch (e) { return null; }
}

function handler(req, res){
  var p = req.url.split('?')[0];
  var f = fileFor(p);
  if (!f) for (var i = 0; i < RULES.length; i++) if (RULES[i].re.test(p)) { f = fileFor(RULES[i].dest); break; }
  if (!f) { res.writeHead(404); return res.end('Not found'); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}

if (require.main === module) {
  var port = +process.argv[2] || 8080;
  http.createServer(handler).listen(port, function(){ console.log('http://localhost:' + port + '  (' + PUB + ')'); });
}
module.exports = { handler: handler };
