# CLAUDE.md — kids0-9 sayti: arxitektura, qoidalar va ish jurnali

Bu fayl — shu repoda ishlaydigan **har bir AI agent va dasturchi** uchun asosiy
yo'riqnoma. Yangi sessiyani boshlashda **avval shu faylni to'liq o'qing**.

- 1–6-bo'limlar — sayt qanday tuzilgan (arxitektura).
- 7-bo'lim — **QONUN-QOIDALAR**. Bular majburiy.
- 8-bo'lim — tayyor retseptlar ("mahsulot qanday qo'shiladi" va h.k.).
- 10-bo'lim — ish jurnali (tarix). Har bir katta ishdan keyin **yangi yozuv
  qo'shing**, eskisini o'chirmang.

---

## 1. Sayt nima?

**Kids 0-9** — Kanada (Homeocan) bolalar gomeopatik vositalari liniyasining
O'zbekistondagi sayti. Uch qismdan iborat:

| Qism | Manzil | Kim uchun |
|---|---|---|
| Asosiy sayt (o'zbekcha) | `/`, `/mahsulotlar`, `/mahsulot/<slug>` … | Ota-onalar, dorixonalar |
| Asosiy sayt (ruscha) | `/ru/`, `/ru/mahsulotlar` … | Xuddi shu, rus tilida |
| Bilim marafoni | `/bilim-marafoni` | Farmatsevtlar uchun 10 bosqichli test + admin panel |

Texnologiya: **statik sayt**, build yo'q, framework yo'q, `npm install` yo'q.
Vanilla JS (ES5 uslubida: `var`, `function`), bitta sahifali ilova (SPA).
Joylash: **Firebase Hosting** (loyiha id: `kids09-84499`). Marafon ma'lumotlari:
**Cloud Firestore** + **Firebase Auth** (faqat admin uchun).

---

## 2. Repo tuzilishi

```
/
├── CLAUDE.md                     ← shu fayl
├── firebase.json                 ← Hosting: public papka + rewrite qoidalari
├── firestore.rules               ← Firestore xavfsizlik qoidalari (qo'lda deploy!)
├── .firebaserc                   ← loyiha id: kids09-84499
├── .github/workflows/
│   ├── firebase-hosting-merge.yml   ← main'ga push → smoke-test → Hosting deploy
│   └── smoke-test.yml               ← har bir PR/push'da smoke-test
├── tools/                        ← faqat test/dev uchun (saytga chiqmaydi)
│   ├── serve.js                     ← lokal server (firebase.json rewrites bilan)
│   ├── smoke-test.js                ← avtomatik test (Playwright)
│   └── firebase-mock.js             ← testda Firebase o'rniga ishlaydigan soxta SDK
├── design/product-photos/        ← mahsulotlarning katta asl PNG rasmlari (saytda ishlatilmaydi)
└── public/                       ← SAYTGA CHIQADIGAN hamma narsa shu yerda
    ├── index.html                   ← UZ sahifa qobig'i (header, footer, skriptlar)
    ├── ru/index.html                ← RU sahifa qobig'i
    ├── favicon.svg, favicon.png
    ├── images/*.webp                ← mahsulot rasmlari (saytda shular ishlatiladi)
    ├── assets/
    │   ├── css/site.css             ← UZ+RU uchun UMUMIY dizayn
    │   └── js/
    │       ├── config.js            ← kontaktlar, tillar, mahsulotlar ro'yxati (umumiy)
    │       ├── i18n/uz.js           ← o'zbekcha matnlar + mahsulot matnlari + test
    │       ├── i18n/ru.js           ← ruscha matnlar (uz.js bilan AYNAN bir xil tuzilish)
    │       └── site.js              ← dvijok: router, savat, sahifalar, SEO teglar
    └── bilim-marafoni/
        ├── index.html               ← marafon ilovasi (CSS + JS bitta faylda)
        └── bank.js                  ← savollar banki (100 savol), bosqichlar, tarmoqlar, filiallar
```

---

## 3. Asosiy sayt (UZ + RU) arxitekturasi

### 3.1. "Bitta qolip" printsipi

Ilgari UZ va RU sahifalar **ikki alohida nusxa** edi (har birida 800+ qator
CSS+JS). Bir agent UZ'ni, boshqasi RU'ni o'zgartirgani uchun ular bir-biridan
uzoqlashib, RU'da jiddiy xatolar paydo bo'lgan (10-bo'limga qarang).
Endi tuzilish shunday:

```
public/index.html  ─┐                      ┌─ assets/css/site.css   (umumiy dizayn)
public/ru/index.html┘ → yuklaydi (tartib!) →├─ assets/js/config.js   (umumiy ma'lumot)
                                            ├─ assets/js/i18n/<til>.js (faqat matn)
                                            └─ assets/js/site.js     (umumiy kod)
```

- **Kod bitta** (`site.js`) — xatoni bir marta tuzatsangiz, ikkala tilda tuzaladi.
- **Dizayn bitta** (`site.css`).
- **Matnlar alohida** (`i18n/uz.js`, `i18n/ru.js`) — faqat shu yerda til farq qiladi.
- HTML fayllarda faqat: `<head>` (SEO meta), header, footer va 3 ta `<script>`.

### 3.2. Fayllar vazifasi

**`config.js`** (global o'zgaruvchilar):
- `CONFIG` — telefon, telegram, whatsapp, email, `marathonUrl`.
- `LANGS` — tillar ro'yxati: `{code:'uz', base:''}`, `{code:'ru', base:'/ru'}`.
- `PRODUCTS` — mahsulotlar **tartibi** va tilga bog'liq bo'lmagan maydonlar:
  `slug`, `name`, `color`, `cats` (katalog filtrlari), `img`, `src` (homeocan.ca havolasi).

**`i18n/<til>.js`** → `window.LANG = { code, t, products, pharmacies, quiz }`:
- `t` — interfeys matnlari, bo'limlarga ajratilgan: `nav`, `meta`, `home`,
  `catalog`, `cats`, `product`, `where`, `order`, `pharm`, `company`, `safety`,
  `contact`. Ba'zilari funksiya (masalan `t.flavor(f)`, `t.meta.product(p)`),
  chunki so'z tartibi tilga qarab farq qiladi.
- `products` — `slug` → `{sub, form, vol, flavor, age, tags, lead, desc, about, vs, warn?, dose[], comp[[lotincha, mahalliy nomi, ta'siri]]}`.
- `pharmacies` — dorixonalar ro'yxati (hozircha **namunaviy**, soxta raqamlar).
- `quiz` — farmatsevtlar uchun 8 savollik qisqa test (`a` — to'g'ri javob indeksi, 0 dan).

**`site.js`** (IIFE, global o'zgaruvchi chiqarmaydi):
- `P` — `PRODUCTS` + `LANG.products` birlashtirilgan ro'yxat.
- Ko'rinishlar: `vHome`, `vCatalog`, `vProduct`, `vWhere`, `vOrder`, `vPharm`,
  `vCompany`, `vSafety`, `vContact`, `vNotFound`. Har biri HTML satr qaytaradi.
- `ROUTES` jadvali + `known()` / `resolve()` / `render()` — router.
- `setHead()` — har sahifada `<title>`, `description`, `canonical`, `hreflang`
  (uz, ru, x-default) va 404 uchun `noindex` qo'yadi.
- `paintNav()` — menyu, joriy bo'lim belgisi, footer kontaktlari, til almashtirgich.
- `u(path)` — tilga mos havola yasaydi: UZ'da `u('/mahsulotlar')` → `/mahsulotlar`,
  RU'da → `/ru/mahsulotlar`. **Ichki havolalarni doim `u()` bilan yozing.**

### 3.3. Marshrutlar (URL'lar)

| URL (UZ) | URL (RU) | Ko'rinish |
|---|---|---|
| `/` | `/ru/` | `vHome` |
| `/mahsulotlar` | `/ru/mahsulotlar` | `vCatalog` |
| `/mahsulot/<slug>` | `/ru/mahsulot/<slug>` | `vProduct` |
| `/qayerdan-olish` | `/ru/qayerdan-olish` | `vWhere` |
| `/buyurtma` | `/ru/buyurtma` | `vOrder` (savat + buyurtma formasi) |
| `/farmatsevtlarga` | `/ru/farmatsevtlarga` | `vPharm` (qisqa test) |
| `/kompaniya` | `/ru/kompaniya` | `vCompany` |
| `/xavfsizlik` | `/ru/xavfsizlik` | `vSafety` |
| `/aloqa` | `/ru/aloqa` | `vContact` |
| boshqa har qanday | | `vNotFound` + `<meta name="robots" content="noindex">` |

URL slug'lari **ikkala tilda bir xil** (o'zbekcha). Shuning uchun til
almashtirgich `/mahsulot/colic` ↔ `/ru/mahsulot/colic` kabi aynan shu sahifaga
olib boradi. Firebase `firebase.json` rewrite'lari: `/ru/**` → `ru/index.html`,
`/bilim-marafoni/**` → marafon, qolgan hamma narsa → `index.html`. Mavjud fayllar
(`/assets/...`, `/images/...`, `bank.js`) rewrite'dan oldin to'g'ridan-to'g'ri beriladi.

### 3.4. Holat va localStorage

| Kalit | Nima | Qayerda |
|---|---|---|
| `kids09_cart` | Savat `{slug: soni}` — **ikkala til uchun bitta** | site.js |
| `kids09_cart_ru` | Eski RU savati (faqat bir marta ko'chirish uchun o'qiladi) | site.js |
| `kids09-bm-progress-v1` | Marafon: login + tugallanmagan bosqich | marafon |
| `kids09-bm-mine-v1` | Marafon: shu qurilmadagi o'z natijalari (qisqa) | marafon |
| `__mockdb`, `__mockauth` | Faqat testdagi soxta Firebase | tools/firebase-mock.js |

Buyurtma serverga yuborilmaydi — matn tayyorlanib Telegram/WhatsApp'da ochiladi
(`orderText()`).

---

## 4. "Bilim marafoni" arxitekturasi

Fayllar: `public/bilim-marafoni/index.html` (CSS + Firebase + ilova JS) va
`public/bilim-marafoni/bank.js` (`window.BANK` — savollar va boshlang'ich ma'lumot).

### 4.1. Holat (state)

Global `S` obyekti (qidirish: `var S={ready:`):
- `S.view`: `'enter' | 'test' | 'done' | 'admin'`
- `S.me`: `{chainId, chainName, branchId, branchName, first, last}` — kim kirgan
- `S.session`: joriy bosqich (savollar, `answers[]`, `idx`, vaqt)
- `S.review`: tugagan bosqich natijasi (`detail[]` bilan)
- `S.setup`: `meta/setup` dan olingan konfiguratsiya (config, stages, questions, chains, branches)
- `S.results`: barcha natijalar — **faqat admin login qilganda** to'ladi
- `S.authed`: admin kirganmi; `S.setupDirty`: setup'ni admin kirganda yozish kerakmi

`render()` → `S.view` ga qarab `viewEnter / viewStages / viewTest / viewDone / viewAdmin`
dan birini chaqiradi va `app.innerHTML` ga yozadi. Klikler bitta delegatorda
(`app.addEventListener('click'`), `data-act="..."` atributi orqali.

### 4.2. Firestore va ruxsatlar (firestore.rules)

| Hujjat | O'qish | Yozish |
|---|---|---|
| `meta/setup` (`payload` = butun `S.setup`) | hamma | faqat admin (`request.auth != null`) |
| `results/{id}` (har bir tugagan bosqich) | faqat admin | hamma **yangi** yarata oladi; o'zgartirish/o'chirish — admin |

**Muhim oqibat:** anonim farmatsevt `results`ni o'qiy olmaydi va `meta/setup`ga
yoza olmaydi. Shuning uchun:
- Farmatsevtning "qaysi bosqich tugagan" ma'lumoti `kids09-bm-mine-v1`
  (localStorage) dan olinadi — `myData()` = `S.results` + `loadMine()`.
- Farmatsevt qo'lda yozgan yangi filial Firestore'ga yozilmaydi. U barqaror
  id oladi: `m-<chainId>-<nom>` (`manualBranchId()`), natijalarga shu id bilan
  yoziladi. Admin kirganda `syncSetupAsAdmin()` natijalardagi noma'lum
  filiallarni ro'yxatga qo'shib, `meta/setup`ga yozadi.
- Savollar banki versiyasi (`BANK.ver`) o'zgarsa, `refreshBank()` farmatsevtda
  faqat xotirada yangilaydi (`S.setupDirty=true`); admin kirganda Firestore'ga yoziladi.

### 4.3. Ishga tushish tartibi

1. `sGet('setup')` → `S.setup` (yo'q bo'lsa `DEFAULT_SETUP`, `setupDirty=true`).
2. `S.setup.ver !== BANK_VER` bo'lsa → `refreshBank()` (admin ochgan/yopgan
   bosqichlar va filiallar saqlanadi).
3. `restoreLocal()` — localStorage'dan login va tugallanmagan bosqich tiklanadi
   (bank versiyasi o'zgargan yoki filial topilmasa — bekor qilinadi).
4. `auth.onAuthStateChanged` — admin bo'lsa `loadAdminData()` (natijalarni yuklash
   + `syncSetupAsAdmin()`); chiqsa `S.results=[]`.

### 4.4. Test oqimi

`startStage(sid)` → `S.session` (savollar aralashtiriladi) → `pick/next/prev` →
har qadamda `saveLocal()` → `finish()` → ball, `S.review`, `addResultDoc()` →
muvaffaqiyatli saqlansa `addMine()` → `viewDone()` ("Xatolarni ko'rish" tugmasi bilan).

### 4.5. Reyting formulasi

`branchStats()`: moslashtirilgan ball = `(n × filial o'rtachasi + K × tarmoq o'rtachasi) / (n + K)`.
Filial sovringa da'vogar bo'lishi uchun `staff > 0` va qamrov ≥ `minCoverage`%.

---

## 5. SEO holati (asosiy sayt)

- Har bir sahifaning o'z `<title>` va `description`i bor (`t.meta` — i18n fayllarda).
- `canonical` va `hreflang` (uz, ru, x-default) JS orqali `location.origin` bilan
  qo'yiladi — domen kodga yozilmagan.
- 404 sahifada `noindex`. Marafon sahifasida doim `noindex` (ichki vosita).
- Rasmlarda tavsifli `alt` (`t.alt(p)`).
- Kontent JS bilan chiziladi (SPA). Google buni render qiladi, lekin boshqa
  qidiruv/AI botlar ko'rmasligi mumkin — 9-bo'limga qarang.

---

## 6. Deploy va CI

- `main` branch'ga push → GitHub Actions: **avval `tools/smoke-test.js`**, test
  o'tsa → Firebase Hosting'ga deploy (`firebase-hosting-merge.yml`).
- Boshqa branch'lar va PR'larda faqat smoke-test ishlaydi (`smoke-test.yml`).
- **`firestore.rules` avtomatik deploy QILINMAYDI.** O'zgartirsangiz, qo'lda:
  `firebase deploy --only firestore:rules`.
- Build qadami yo'q — `public/` dagi fayllar o'zi serve qilinadi.
- Firebase web config (`apiKey` va h.k.) HTML'da ochiq turadi — bu **normal**
  (maxfiy kalit emas). Xavfsizlik `firestore.rules` orqali.

---

## 7. QONUN-QOIDALAR (majburiy)

### Umumiy
1. **Avval o'qing, keyin o'zgartiring.** Ishni boshlashdan oldin shu faylni va
   o'zgartiradigan faylni o'qing.
2. **Push qilishdan oldin smoke-test yashil bo'lishi shart:**
   `NODE_PATH=/opt/node22/lib/node_modules node tools/smoke-test.js` → `0 FAIL`.
3. **Build tool, framework, npm paket qo'shmang.** Sayt statik va oddiy qolsin.
4. Kod uslubi: ES5 (`var`, `function`, satrlarni `+` bilan ulash), 2 bo'shliqli
   chekinish, izohlar o'zbekcha. Atrofdagi kodga o'xshatib yozing.
5. Foydalanuvchi kiritgan yoki tashqi matnni HTML'ga qo'yishda **doim `esc()`**
   ishlating. i18n `t.*` matnlari — ishonchli, HTML bo'lishi mumkin.

### Asosiy sayt (UZ/RU)
6. **Ikki tilni hech qachon alohida nusxa qilmang.** Kod — faqat `site.js`,
   dizayn — faqat `site.css`. HTML qobiqlarga JS/CSS mantiq qo'shmang.
7. **Matnni kodga yozmang.** Har qanday ko'rinadigan matn — `i18n/uz.js` VA
   `i18n/ru.js` ga, **bir xil kalit bilan**. Smoke-test kalitlar mosligini tekshiradi.
8. Mahsulotning rasmi, rangi, tartibi, havolasi, filtri — faqat `config.js`da.
   Mahsulot matni — i18n fayllarda, `slug` kaliti ostida.
9. Ichki havolalar — doim `u('/yo'l')` orqali (til prefiksi avtomatik qo'shiladi).
   Marafonga havola — `CONFIG.marathonUrl`.
10. Yangi sahifa qo'shsangiz: `ROUTES` ga qo'shing, `t.meta` ga title/description
    yozing (ikkala tilda), smoke-test'dagi `routes` ro'yxatiga qo'shing.
11. **Kesh versiyasi:** `assets/` dagi yoki `bank.js` faylini o'zgartirsangiz,
    uni chaqirgan HTML'dagi `?v=YYYYMMDD` ni yangilang (UZ va RU ikkalasida ham).
    Aks holda foydalanuvchida eski fayl ochilib qolishi mumkin.

### Bilim marafoni
12. `S.me` yoki `S.session` ni o'zgartiradigan har qanday joyda **`saveLocal()`**
    chaqiring.
13. Savol/bosqich/tarmoq/filial ro'yxatini (`bank.js`) o'zgartirsangiz —
    **`BANK.ver` ni oshiring** va `index.html`dagi `bank.js?v=` ni yangilang.
    Savol `id`lari noyob bo'lsin (smoke-test tekshiradi).
14. Anonim foydalanuvchi uchun Firestore'ga faqat `results` **create** mumkin.
    `meta/setup`ga yozish yoki `results`ni o'qishni faqat `S.authed` bo'lganda qiling.
15. `results` hujjatidagi majburiy maydonlarni (`firestore.rules` → `hasAll([...])`)
    o'zgartirsangiz, qoidalarni ham yangilang va qo'lda deploy qiling.
16. `firebaseConfig` ni "maxfiy ma'lumot sizib chiqdi" deb o'chirmang — bu public config.

### Git
17. Kichik, tushunarli commitlar. Commit xabarida **nima va nima uchun**.
18. Katta o'zgarishdan keyin shu faylning 10-bo'limiga jurnal yozuvi qo'shing.

---

## 8. Retseptlar (qanday qilinadi)

**Telefon / Telegram / email o'zgartirish** → `public/assets/js/config.js` → `CONFIG`.
Keyin HTML'lardagi `config.js?v=` ni yangilang.

**Yangi mahsulot qo'shish**
1. Rasmni `public/images/<slug>.webp` ga qo'ying (≈ 50 KB, WebP).
2. `config.js` → `PRODUCTS` ga `{slug, name, color, cats, img, src}` qo'shing.
3. `i18n/uz.js` va `i18n/ru.js` → `products` ga shu `slug` bilan matn qo'shing.
4. Kerak bo'lsa hero faktlaridagi "10 ta mahsulot" matnini yangilang (`t.home.facts`).
5. `?v=` larni yangilang, smoke-test'ni ishga tushiring.

**Matnni tuzatish** → tegishli `i18n/<til>.js` faylida. Ikkinchi tilni ham tekshiring.

**Yangi til qo'shish** (masalan, `en`)
1. `config.js` → `LANGS` ga `{code:'en', base:'/en', label:'EN'}`.
2. `i18n/en.js` — `uz.js` nusxasi, tarjima qilingan.
3. `public/en/index.html` — `ru/index.html` nusxasi (lang, header/footer matni,
   `i18n/en.js`), header'dagi `.lang` ga `<a data-lang-link="en">` qo'shing
   (barcha HTML'larda).
4. `firebase.json` → `/en` va `/en/**` rewrite'larini qo'shing.
5. `site.js` va smoke-test'ni yangi til bilan tekshiring.

**Marafonga savol qo'shish** → `bank.js` → `questions` ga
`{"id":"q101","stage":"s3","cat":"","text":"...","options":[...],"correct":0,"expl":"..."}`,
`ver` ni oshiring, `bank.js?v=` ni yangilang. (Yoki admin panel → Savollar orqali —
u holda faqat Firestore'da o'zgaradi, `bank.js`da emas.)

**UI'ni lokal ko'rish** → `node tools/serve.js 8080` → `http://localhost:8080`.
Marafon lokal serverda haqiqiy Firebase'ga ulanadi (internet bo'lsa).

---

## 9. Ma'lum cheklovlar va tavsiyalar (hali qilinmagan)

1. **Xavfsizlik — Firebase Auth ro'yxatdan o'tish (sign-up).** Qoidalarda "admin"
   = har qanday login qilgan foydalanuvchi (`request.auth != null`). Agar
   Firebase Console → Authentication → Settings → *User actions* da
   **"Enable create (sign-up)"** yoqilgan bo'lsa, `apiKey` ni bilgan har kim
   o'zi akkaunt ochib, barcha natijalarni o'qishi/o'chirishi mumkin.
   **Tavsiya:** o'sha belgini o'chiring (kod o'zgarmaydi). Yanada kuchlisi —
   qoidalarda admin email/UID ro'yxatini tekshirish.
2. **Marafon progressi faqat shu qurilmada.** Farmatsevt boshqa telefondan kirsa,
   tugatgan bosqichlari "tugallandi" ko'rinmaydi (natijalar esa Firestore'da bor).
   To'liq yechim — Firebase Anonymous Auth + o'z natijalarini o'qish qoidasi.
3. **Domen kodga yozilmagan** — shuning uchun `sitemap.xml` va `robots.txt`dagi
   `Sitemap:` qatori yo'q. Asosiy domen aniq bo'lgach qo'shish kerak.
4. **SEO: kontent JS bilan chiziladi.** Google render qiladi, lekin AI/boshqa
   botlar bo'sh sahifa ko'rishi mumkin. Keyingi qadam — har bir sahifa uchun
   oldindan tayyorlangan statik HTML (pre-render) yoki `<noscript>` kontent.
5. **Soft 404:** `firebase.json` dagi `"**" → /index.html` noma'lum URL'ga 200
   qaytaradi. `noindex` qo'yilgan, lekin haqiqiy 404 status yo'q.
6. `PHARM` (dorixonalar) va `CONFIG` dagi telefonlar — **namunaviy** qiymatlar.
7. Marafon hali bitta katta fayl (CSS+JS ~1300 qator). Keyingi qadam — CSS va
   JS'ni `bilim-marafoni/app.css`, `app.js` ga ajratish.
8. Admin panelida yo'q: savollar bo'yicha xato statistikasi, farmatsevtning
   barcha urinishlari tarixi.

---

## 10. Ish jurnali (tarix — o'chirmang, faqat qo'shing)

### 2026-08-26 → 2026-09-18 — boshlang'ich ishlar
- Sanjar Ismon: Firebase (Firestore + Auth + Hosting) bilan bilim marafoni (`f8953d0`).
- Claude: marafon `/bilim-marafoni` ga ko'chirildi; bosh sahifa to'liq marketing
  saytiga almashtirildi; GitHub Actions deploy qo'shildi; mahsulot rasmlari (WebP).
- Abrorbek Malikov (boshqa AI agent orqali): favicon, Google Search Console
  meta, **rus tilidagi versiya** (`public/ru/index.html`, `8c6a78e`), til
  almashtirgich, RU rasm yo'llari tuzatildi.

### 2026-09-22 — marafon: progressni saqlash va xatolarni ko'rish (Claude)
Ticket: (1) farmatsevt bosqichni yarmida tashlab ketsa, qayta kirganda progress
yo'qolardi; (2) test oxirida xatolarni ko'rib bo'lmasdi.
- `saveLocal/loadLocal/clearLocal` (`kids09-bm-progress-v1`) — login va joriy
  bosqich localStorage'da saqlanadi, reload'dan keyin aynan shu savoldan davom etadi.
- `viewDone()` ga "Xatolarni ko'rish (N)" tugmasi, `reviewItemHtml()` yordamchisi.
- Commit `b1f60b8`. Test: Playwright + mock Firebase.
- ⚠️ **Tuzatish (2026-09-26):** o'sha yozuvda "qo'lda yozilgan filial reload'da
  yo'qolishi faqat mock'ning cheklovi, haqiqiy Firestore'da bo'lmaydi" deyilgan
  edi — bu **noto'g'ri** edi. Haqiqiy `firestore.rules` anonim foydalanuvchiga
  `meta/setup`ga yozishni taqiqlaydi, ya'ni muammo real edi. 2026-09-26 da tuzatildi.

### 2026-09-26 — to'liq audit, xatolarni tuzatish, "bitta qolip" arxitekturasi (Claude)

**Vazifa (foydalanuvchidan):** saytni 2 ta AI agent 2 xil joydan o'zgartirgan —
xatolarni topib tuzatish, hammasini bitta qolipga solish, arxitektura va
qoidalarni CLAUDE.md ga yozish.

**Qanday tekshirildi:** `tools/smoke-test.js` yozildi (Playwright + Chromium,
`tools/serve.js` — firebase.json rewrite'lari bilan lokal server,
`tools/firebase-mock.js` — firestore.rules'ni taqlid qiladigan soxta Firebase).
Eski kodda: **29 PASS, 21 FAIL**. Tuzatishlardan keyin: **67 PASS, 0 FAIL**.

**Topilgan xatolar va tuzatishlar:**

| # | Joy | Xato | Tuzatish |
|---|---|---|---|
| 1 | RU `/ru/buyurtma` | `vCart()` chaqirilgan, funksiya esa `vOrder` → **savat sahifasi butunlay ishlamasdi** (JS xato) | Umumiy `site.js` router |
| 2 | RU `/ru/farmatsevtlarga` | `vPharma()` chaqirilgan, funksiya `vPharm` → **farmatsevt sahifasi ishlamasdi** | Umumiy router |
| 3 | RU | Marafon havolasi `kids09-marafon-v2-final_new.html` — mavjud bo'lmagan fayl | `CONFIG.marathonUrl='/bilim-marafoni'` |
| 4 | RU menyu | Joriy bo'lim hech qachon belgilanmasdi (`paintNav` yo'l solishtirish xatosi) | Umumiy `paintNav` |
| 5 | RU | Favicon yo'q, rasmlarda `alt` faqat nom | Umumiy qobiq, `t.alt()` |
| 6 | RU footer | "О нас" → `/ru/aloqa` (Контакты bilan takror) | Olib tashlandi |
| 7 | RU matn | "Почему выбирают родителям", "сфомируется" | "родители", "сформируется" |
| 8 | UZ↔RU | Savat ikki tilda alohida (`kids09_cart_ru`) — til almashtirsa savat yo'qolardi | Bitta `kids09_cart` (eski RU savati bir marta ko'chiriladi) |
| 9 | UZ↔RU | Til almashtirgich har doim bosh sahifaga olib borardi | Shu sahifaning boshqa tildagi manziliga |
| 10 | SEO | Barcha sahifalarda bir xil `<title>`/description; `canonical`, `hreflang` yo'q; 404 indekslanardi | `setHead()` + `t.meta` |
| 11 | Arxitektura | UZ va RU — 2 ta mustaqil nusxa (1600+ qator takror), bir-biridan uzoqlashgan | `site.css` + `config.js` + `i18n/*.js` + `site.js` |
| 12 | Marafon | `<!DOCTYPE html>`, `<html>`, `<head>`, `<body>` yo'q → brauzer quirks mode | To'g'ri HTML skeleti + `noindex` |
| 13 | Marafon | Anonim farmatsevt `results`ni o'qiy olmaydi → **reload'dan keyin tugatilgan bosqichlar "tugallanmagan" ko'rinardi**, 2-bosqichga o'ta olmasdi | `kids09-bm-mine-v1` + `myData()` |
| 14 | Marafon | Admin sahifa ochilgandan keyin login qilsa, natijalar bo'sh ko'rinardi (natijalar login'dan oldin yuklangan, ruxsat yo'q edi) | `onAuthStateChanged` → `loadAdminData()` |
| 15 | Marafon | Qo'lda yozilgan filial tasodifiy id oladi va saqlanmaydi → reload'da login yo'qoladi, qayta kirsa natijalar boshqa id'ga bo'linib ketadi | Barqaror id `m-<chain>-<nom>`, `restoreLocal()`, admin'da `syncSetupAsAdmin()` |
| 16 | Marafon | Anonim foydalanuvchi har safar `meta/setup`ga yozishga urinardi (ruxsat yo'q, jim xato) va "Savol banki yangilandi" toast'ini ko'rardi | Yozish/toast faqat admin'da (`setupDirty`) |
| 17 | Marafon | Savolsiz bosqich `class="stage empty"` → `.empty::after` "ayiqcha" rasmi kartaga tushardi | Holat nomi `noq` |
| 18 | Marafon admin | KPI'da "10 tadan" qattiq yozilgan | `S.setup.stages.length` |
| 19 | Marafon | `STAGE_TITLES` — ishlatilmaydigan kod; 57 000 belgilik bitta qator | O'chirildi; bank `bank.js` ga, har savol alohida qatorda |
| 20 | Marafon | Bosqich kartasi (`role="button"`) klaviaturada ishlamasdi | Enter/Space qo'llab-quvvatlandi |
| 21 | Marafon admin | Natijasi bor filialni o'chirish ogohlantirishsiz | Ogohlantirish + "Birlashtirish" maslahati |
| 22 | Repo | 30 MB PNG'lar ildizda; eski CLAUDE.md ularni "saytda ishlatiladi" degan — noto'g'ri | `design/product-photos/` ga ko'chirildi |
| 23 | CI | Test yo'q edi, buzilgan kod to'g'ridan-to'g'ri deploy bo'lardi | Smoke-test CI'da, deploy undan keyin |

**Vizual tekshiruv:** eski va yangi versiya skrinshotlari solishtirildi — UZ
sahifalar piksel-piksel bir xil; RU'da faqat kutilgan farqlar (menyu belgisi,
brend osti yozuvi "Продукция Канады").

**RU matnlaridagi o'zgarishlar:** imlo xatolaridan tashqari, bir nechta RU matn
UZ mazmuniga moslashtirildi (RU'da qisqaroq yoki farqli edi): xavfsizlik
ogohlantirishi (toshma, suvsizlanish bandlari), FAQ 2–3 javoblari, "Границы
применения", farmatsevt testi natija matni, marafon kartasi matni, buyurtma
izohi, kompaniya matnidagi "натуральных" so'zi olib tashlandi (UZ'da yo'q).

**O'zgarmagan narsalar:** dizayn, UZ matnlari, URL'lar, Firestore tuzilishi,
`firestore.rules`, marafon mantiqining qolgan qismi.
