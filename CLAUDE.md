# CLAUDE.md — ish jurnali (AI agentlar uchun yo'riqnoma)

Bu fayl kids0-9 saytida ishlagan AI agentlar uchun log/yo'riqnoma sifatida
yuritiladi. Yangi sessiya boshlaganda avval shu faylni o'qing — repo
tuzilishi, "Bilim marafoni" ilovasining ichki mantig'i va oldin qilingan
o'zgarishlar shu yerda tavsiflangan. Har bir katta o'zgarishdan keyin bu
faylga yangi bo'lim qo'shib boring (eskisini o'chirmang — bu tarixiy log).

---

## 1. Repo umumiy tuzilishi

Bu statik sayt, build-tool/bundler yo'q. Firebase Hosting orqali joylanadi.

```
/                       — repo ildizi
├── public/             — Firebase Hosting "public" katalogi (firebase.json'da ko'rsatilgan)
│   ├── index.html       — asosiy landing (o'zbek)
│   ├── ru/index.html    — rus tilidagi versiya
│   └── bilim-marafoni/
│       └── index.html   — "Bilimlar marafoni" test ilovasi (SPA, bitta fayl)
├── firebase.json        — Hosting rewrite qoidalari + Firestore rules yo'li
├── firestore.rules      — Firestore xavfsizlik qoidalari
├── .firebaserc          — Firebase loyiha id: kids09-84499
└── *.png                — mahsulot rasmlari (asosiy sahifada ishlatiladi)
```

Deploy: `firebase deploy` (yoki CI/CD) — kodni o'zgartirgandan keyin build
qadam kerak emas, `public/` papkadagi fayllar to'g'ridan-to'g'ri serve
qilinadi.

Firebase config (`apiKey`, `authDomain` va h.k.) HTML ichida ochiq yozilgan
— bu **normal holat**, Firebase web SDK'sida bu maxfiy kalit emas (public
config). Haqiqiy xavfsizlik `firestore.rules` orqali ta'minlanadi. Buni
"maxfiy ma'lumot sizib chiqqan" deb xato hisoblamang.

---

## 2. "Bilim marafoni" ilovasi — arxitektura

Fayl: `public/bilim-marafoni/index.html` (~1260 qator, bitta fayl: CSS +
Firebase CDN skriptlar + vanilla JS IIFE). Framework yo'q, build yo'q.

### Muhim: fayl ichida bitta juda uzun qator bor

**Qator ~300** — bu `DEFAULT_SETUP` obyektining davomi: savollar banki
(`questions` massivi, yuzlab savol) va boshqa default ma'lumotlar bitta
qatorga yozilgan (~57000 belgi). Oddiy `Read` tool bu qatorni to'liq o'qiy
olmaydi (token limitiga uradi). Buni o'qish/qidirish uchun:

```bash
grep -n "function XXX" public/bilim-marafoni/index.html   # funksiya joylarini topish
sed -n '300p' public/bilim-marafoni/index.html | grep -o "..."  # qator ichidan qidirish
```

Yoki `Grep` tool bilan pattern qidiring — butun faylni emas, faqat kerakli
qismni o'qing (`Read` ga `offset`/`limit` bering).

### Holat boshqaruvi (state)

Global `S` obyekti (~qator 353) — butun ilova holati shu yerda:
`S.view` ('enter' | 'test' | 'done' | 'admin'), `S.me` (kim login qilgan:
chainId/branchId/first/last), `S.session` (joriy ishlayotgan bosqich:
savollar, javoblar, idx, vaqt), `S.review` (tugagan bosqich natijasi),
`S.setup` (Firestore'dan/DEFAULT_SETUP'dan olingan konfiguratsiya).

Render: `render()` funksiyasi `S.view`ga qarab `viewEnter()` /
`viewStages()` / `viewTest()` / `viewDone()` / `viewAdmin()` dan birini
chaqiradi va `app.innerHTML` ga yozadi (real DOM diffing yo'q — har safar
to'liq qayta chiziladi). Click'lar `data-act` atributi orqali bitta global
`app.addEventListener('click', ...)` delegatorida ushlanadi (~qator 1024).

### Firestore tuzilishi

- `meta/setup` — bitta hujjat, `payload` maydonida butun `S.setup` JSON
  saqlanadi (config, stages, questions, chains, branches). O'qish hammaga
  ochiq, yozish faqat admin (`request.auth != null`).
- `results/{id}` — har bir tugatilgan bosqich uchun bitta hujjat (ism,
  filial, ball, foiz, davomiylik va h.k.). Ishtirokchi (anonim, login
  qilmagan) faqat **yangi** hujjat yarata oladi (`create`), o'chira/
  o'zgartira olmaydi. O'qish/o'chirish/o'zgartirish faqat admin.
- `BANK_VER` konstantasi (JS ichida) — savollar banki versiyasi. Agar
  Firestore'dagi `setup.ver` bu qiymatdan farq qilsa, `refreshBank()`
  chaqirilib, savollar/bosqichlar DEFAULT_SETUP'dan yangilanadi (lekin
  admin ochgan/yopgan bosqich holati va filiallar saqlanib qoladi).

### Test oqimi (bitta bosqich)

`startStage(sid)` → `S.session` yaratiladi (savollar aralashtiriladi,
`answers` massivi `null` bilan to'ldiriladi) → `S.view='test'`.
`pick`/`next`/`prev` — `S.session.answers[idx]` va `S.session.idx`ni
o'zgartiradi. `finish(auto)` — ballni hisoblaydi, `S.review` yaratadi,
`S.session=null`, natijani `addResultDoc()` orqali Firestore'ga yozadi,
`S.view='done'`.

---

## 3. 2026-09-22 sessiyasida qilingan o'zgarishlar

**Ticket (foydalanuvchi tomonidan yozilgan 2 ta muammo):**
1. Farmatsevt 10 bosqichli testni boshlab, biror bosqichda (masalan
   4-savolda) to'xtatib saytdan chiqib ketsa — qayta kirganda progress
   yo'qolib, majburan 1-savoldan boshlashga to'g'ri kelardi.
2. Test/bosqich tugagandan so'ng foydalanuvchi qaysi savollarda xato
   qilganini ko'ra olmasdi.

**Sabab (root cause):** Ilova progressni HECH QAYERDA saqlamas edi —
`S.me` va `S.session` faqat JS xotirasida (in-memory) yashaydi, sahifa
qayta yuklansa yoki yopilsa butunlay yo'qoladi. `localStorage` yoki
`sessionStorage` ishlatilmagan edi. Xatolarni ko'rsatish funksiyasi
(`viewDone()` ichida) mavjud edi, lekin faqat admin panelidagi
"Test oxirida to'g'ri javoblarni ko'rsatish" (`c.showReview`) sozlamasi
yoqilgan bo'lsagina ishlar edi (default: `false`), va u BARCHA savollarni
(to'g'ri + noto'g'ri) ko'rsatardi — foydalanuvchiga aynan xatolarini
ajratib ko'rsatadigan alohida imkoniyat yo'q edi.

### Yechim 1 — Progressni localStorage'da saqlash

`public/bilim-marafoni/index.html` ga qo'shildi (qidirish uchun kalit
so'zlar: `LS_KEY`, `saveLocal`, `loadLocal`, `clearLocal`):

- `LS_KEY = 'kids09-bm-progress-v1'` — localStorage kaliti.
- `saveLocal()` — `{ver: BANK_VER, me: S.me, session: S.session}` ni JSON
  qilib localStorage'ga yozadi (agar `S.me` bo'lmasa, kalitni o'chiradi).
  `try/catch` bilan o'ralgan (localStorage bloklangan/xususiy rejim
  bo'lsa ham ilova ishlashda davom etadi).
- `loadLocal()` / `clearLocal()` — mos ravishda o'qish/tozalash.

**Qayerda chaqiriladi:**
- `login-me` handler'da (login qilingandan keyin) — F.me saqlanadi.
- `startStage()` ichida (bosqich boshlanganda) — yangi session saqlanadi.
- `pick` / `next` / `prev` handler'larda — har bir javob/navigatsiyadan
  keyin session yangilanadi (shu orqali "4-savolda to'xtab qolish" holati
  aniq saqlanadi).
- `finish()` ichida — bosqich tugagach `session=null` saqlanadi (login esa
  qoladi, keyingi safar qayta kirmasin uchun).
- `logout` va admin `factory` (boshlang'ich holatga qaytarish)
  handler'larida — `clearLocal()` chaqiriladi.

**Qayta tiklash (restore):** Ilova yuklanganda (`Promise.all([sGet(...),
loadResults()]).then(...)` — bu boot bloki), `S.setup` tayyor bo'lgandan
keyin `loadLocal()` chaqiriladi:
- Agar saqlangan `ver` joriy `BANK_VER`ga teng bo'lmasa (admin savollar
  bankini yangilagan) — progress butunlay bekor qilinadi.
- Agar `S.me.chainId`/`branchId` endi `S.setup`da topilmasa (masalan
  admin filialni o'chirgan) — bekor qilinadi.
- Agar session bor bo'lsa-yu, lekin bosqich admin tomonidan yopib
  qo'yilgan bo'lsa (`stage.open === false`) — faqat login tiklanadi, test
  sessiyasi tiklanmaydi (foydalanuvchi bosqichlar ro'yxatini ko'radi).
- Aks holda `S.session` to'liq tiklanadi va `S.view='test'` qilinadi —
  foydalanuvchi aynan to'xtagan savolida ko'radi. Agar vaqt chegarasi
  (`timeLimitMin`) bo'lsa, taymer ham qayta ishga tushiriladi.

**Muhim cheklov:** Bu yechim **browser-local** — faqat "shu qurilma / shu
brauzer" doirasida ishlaydi (real backend session emas, chunki
ishtirokchilar anonim, akkaunt yo'q). Agar farmatsevt boshqa qurilmada
yoki brauzerning incognito rejimida ochsa, progress ko'rinmaydi. Bu
ticket'da so'ralgan holatni (saytni yopib, keyinroq **o'sha qurilmada**
qayta kirish) to'liq qamrab oladi.

### Yechim 2 — "Xatolarni ko'rish" tugmasi

`viewDone()` funksiyasi (bosqich tugagandan keyingi natija ekrani) qayta
yozildi:
- Yordamchi funksiya qo'shildi: `reviewItemHtml(d, label)` — bitta
  savolning variantlarini (to'g'ri=yashil ✓, tanlangan-noto'g'ri=qizil ✗)
  va izohini chizadi. Bu avval `c.showReview` blokida inline yozilgan
  edi, endi qayta ishlatiladigan funksiyaga chiqarildi.
- `viewDone()` boshida `wrong` massivi hisoblanadi (`d.chosen !==
  d.correct` bo'lgan savollar).
- Agar `wrong.length > 0` bo'lsa — natija kartasida **"Xatolarni ko'rish
  (N)"** tugmasi chiqadi (bosilganda "Xatolarni yashirish"ga o'zgaradi).
  Bu tugma `c.showReview` admin sozlamasidan **mustaqil** — har doim
  ko'rinadi.
- Tugma bosilganda (`data-act="toggle-errors"` → `S.showErrors` toggle)
  faqat noto'g'ri javob berilgan savollar, ularning to'g'ri javobi va
  izohi bilan alohida kartada ko'rsatiladi.
- Agar xato bo'lmasa (100% natija) — tabrik matni chiqadi, tugma
  ko'rinmaydi.
- Admin'ning eski "Test oxirida to'g'ri javoblarni ko'rsatish"
  (`c.showReview`) sozlamasi **o'zgartirilmadi** — u hali ham yoqilgan
  bo'lsa, BARCHA savollarni (to'g'ri+noto'g'ri) alohida kartada
  ko'rsatishda davom etadi, endi shunchaki `reviewItemHtml()` orqali.
- `S.showErrors` har safar yangi bosqich boshlanganda (`startStage`) va
  yangi natija chiqqanda (`finish`) `false`ga qaytariladi.

### Test qilish usuli (sandbox'da Firebase'siz)

Bu muhitda (sandbox) `gstatic.com`ga chiqish TLS/tunnel xatosi bilan
bloklanadi, shuning uchun haqiqiy Firestore bilan sinab bo'lmaydi. Buning
o'rniga Playwright orqali **mock Firebase** ishlatildi:

1. `python3 -m http.server` bilan `public/` papkasini local serve qilish.
2. Playwright'ning `page.route('**/firebasejs/**', ...)` orqali Firebase
   CDN so'rovlarini ushlab, o'rniga minimal stub JS berish
   (`window.firebase = {initializeApp, firestore(){...}, auth(){...}}`
   — `collection().doc().get()/set()/add()` kabi metodlarni soxta
   Promise bilan qaytaradi).
3. Shu orqali haqiqiy brauzerda to'liq oqim sinaldi: login → bosqich
   boshlash → 4 ta savolga javob → **sahifani reload qilish** (yopib-
   qayta ochishni simulyatsiya qiladi) → progress aynan 5-savoldan
   davom etganini tasdiqlash → bosqichni tugatish → "Xatolarni ko'rish"
   tugmasi chiqib, faqat xato savollarni ko'rsatganini tasdiqlash.
4. Natija: `PAGEERROR` yo'q, ikkala funksiya ham kutilganidek ishladi.

Playwright global `/opt/node22/lib/node_modules`da o'rnatilgan (loyihada
`node_modules` yo'q), Chromium esa `/opt/pw-browsers/chromium`da. Keyingi
agentlar ham shu yo'l bilan (`NODE_PATH=/opt/node22/lib/node_modules
node script.js`, `executablePath: '/opt/pw-browsers/chromium'`) UI'ni
sinab ko'rishlari mumkin — real Firestore'ga muhtoj bo'lmasdan.

**Chain tanlashda diqqat:** Test paytida DEFAULT_SETUP'dagi oldindan
mavjud filiallari bo'lgan tarmoqni tanlang (masalan "Eco pharm" — c8,
`eco1..eco13` filiallari bor). Agar "Ro'yxatda yo'q — qo'lda yozaman"
orqali yangi filial yaratsangiz, u faqat mock'ning shu so'rov davomida
"xotira"sida qoladi — sahifa reload qilinganda mock statik javob
qaytargani uchun yangi yaratilgan filial "yo'qoladi" va
`branchById()` topolmay qoladi (bu mock'ning cheklovi, ilovaning xatosi
emas — haqiqiy Firestore'da bu muammo bo'lmaydi, chunki `findOrCreateBranch`
→ `saveSetup()` haqiqatan ham backend'ga yozadi).

### O'zgartirilgan fayl

- `public/bilim-marafoni/index.html` — yagona o'zgartirilgan fayl
  (+64/-19 qator). Commit: `b1f60b8` (branch `claude/funny-bell-cec4nh`,
  keyin `main`ga fast-forward qilindi).

### Keyingi agentlar uchun eslatmalar

- Yangi funksiya qo'shsangiz va u `S.me` yoki `S.session`ni o'zgartirsa,
  o'sha yerga **`saveLocal()`** chaqiruvini qo'shishni unutmang — aks
  holda yangi holat localStorage bilan sinxronlanmay qoladi va keyingi
  reload'da eskirgan/noto'g'ri holat tiklanishi mumkin.
- `BANK_VER`ni oshirsangiz (savollar bankini yangilasangiz), eski
  saqlangan session'lar avtomatik bekor bo'ladi (`loc.ver===BANK_VER`
  tekshiruvi) — bu qasddan qilingan, savol ID'lari o'zgarsa noto'g'ri
  session tiklanmasligi uchun.
- Admin panelida hali quyidagilar YO'Q (agar kerak bo'lsa, kelajakda
  qo'shish mumkin): bosqichlar bo'yicha umumiy xato-statistikasi
  (qaysi savol eng ko'p xato qilinadi), foydalanuvchiga o'z tarixini
  (barcha o'tgan urinishlarini) ko'rish oynasi. Bular ticket'da so'ralmagan,
  shuning uchun qilinmadi — lekin tabiiy davomi bo'lishi mumkin.
