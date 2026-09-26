/* =======================================================================
   O'ZBEKCHA matnlar va ma'lumotlar (window.LANG).
   Tuzilishi ru.js bilan AYNAN bir xil bo'lishi shart — yangi kalit qo'shsangiz,
   ikkala faylga ham qo'shing. Mahsulot rasmi/rangi/tartibi — config.js'da.
   `t` ichidagi matnlar HTML sifatida chiqadi (<b>, <em> ishlatish mumkin).
   Bu faylni o'zgartirsangiz, HTML'dagi ?v= versiyasini oshiring.
   ======================================================================= */
window.LANG = {
code: 'uz',

t: {
  city: 'Toshkent',
  addedToCart: 'savatga qoʻshildi',
  more: 'Batafsil',
  toCart: 'Savatga',
  flavor: function(f){ return f+' taʼm'; },
  alt: function(p){ return 'Kids 0-9 '+p.name+' — '+p.sub+'. Bolalar uchun gomeopatik vosita qadogʻi.'; },
  notFound: 'Sahifa topilmadi.',
  toHome: 'Bosh sahifaga qaytish',
  nav: { catalog:'Mahsulotlar', where:'Qayerdan olish', pharm:'Farmatsevtlarga', company:'Kompaniya', contact:'Aloqa', cart:'Savat' },
  safetyStrip: '<b>Qachon darhol shifokorga:</b> 3 oygacha chaqaloqda 38 °C harorat · nafas olishning qiyinlashuvi · toʻxtovsiz yigʻi yoki letargiya · alomatlar 2–3 kundan ortiq davom etishi yoki kuchayishi. Kids 0-9 shifokor tayinlagan davolashning oʻrnini bosmaydi.',

  /* SEO: [title, description] har bir sahifa uchun */
  meta: {
    home:     ['Kids 0-9 — Homeocan bolalar salomatligi liniyasi', 'Kids 0-9 — Kanadada ishlab chiqarilgan, tugʻilgandan 9 yoshgacha bolalar uchun gomeopatik vositalar. Spirtsiz, shakarsiz, boʻyoqsiz.'],
    catalog:  ['Mahsulotlar — Kids 0-9 bolalar uchun tomchi va siroplar', 'Kids 0-9 liniyasining barcha 10 ta mahsuloti: tumov, yoʻtal, isitma, sanchiq, tish chiqishi, allergiya va uyqu uchun. Tugʻilgandan 9 yoshgacha.'],
    product:  function(p){ return [p.name+' — '+p.sub+' | Kids 0-9', p.lead+' '+p.form+', '+p.vol+'. '+p.age+'.']; },
    where:    ['Qayerdan olish — Kids 0-9 hamkor dorixonalar', 'Kids 0-9 mahsulotlarini sotadigan dorixonalar roʻyxati: Toshkent, Samarqand, Buxoro, Namangan.'],
    order:    ['Buyurtma berish — Kids 0-9', 'Kids 0-9 mahsulotlariga Telegram yoki WhatsApp orqali buyurtma bering — menejer narx va yetkazib berish boʻyicha bogʻlanadi.'],
    pharm:    ['Farmatsevtlar uchun — Kids 0-9 liniyasi boʻyicha test', 'Farmatsevtlar uchun qisqa test: Kids 0-9 tarkiblari, dozalash va tavsiya qilish holatlari. Toʻliq bilim marafoni ham shu yerda.'],
    company:  ['Homeocan haqida — Kids 0-9 ishlab chiqaruvchisi', 'Homeocan Inc. — 1987-yildan beri Monreal, Kvebek. Health Canada roʻyxatidan oʻtgan gomeopatik vositalar ishlab chiqaruvchisi.'],
    safety:   ['Xavfsizlik va DIN-HM — Kids 0-9', 'DIN-HM nima, Kids 0-9 tarkibida nima yoʻq va qachon darhol shifokorga murojaat qilish kerak.'],
    contact:  ['Aloqa — Kids 0-9', 'Kids 0-9 bilan bogʻlanish: telefon, Telegram, e-pochta. Ota-onalar, dorixonalar va distribyutorlar uchun.'],
    notFound: ['Sahifa topilmadi — Kids 0-9', 'Soʻralgan sahifa topilmadi.']
  },

  home: {
    eyebrow: 'Homeocan · Monreal, Kvebek · 1987',
    h1: 'Bolangiz uchun <em>0 yoshdan</em> boshlanadigan yordam',
    lead: 'Kids 0-9 — tumov, yoʻtal, sanchiq, tish chiqishi va uyqu buzilishlarida qoʻllanadigan Kanada gomeopatik liniyasi. Spirtsiz, shakarsiz, boʻyoqsiz.',
    ctaCatalog: 'Mahsulotlarni koʻrish',
    ctaWhere: 'Yaqin dorixonani topish',
    facts: ['<b>10</b> ta mahsulot', '<b>DIN-HM</b> Health Canada', '<b>0–9</b> yosh', 'spirtsiz · shakarsiz'],
    whyEyebrow: 'Nega Kids 0-9',
    whyTitle: 'Ota-onalar nimaga eʼtibor beradi',
    whyText: 'Tarkib, yosh chegarasi va qoʻllash qulayligi — liniyaning uchta asosiy tayanchi.',
    why: [['Tugʻilgandan boshlab','blue','Barcha mahsulotlar 0 yoshdan ruxsat etilgan. Koʻpgina retseptsiz vositalar 6 yoshgacha tavsiya etilmaydi.'],
          ['Toza tarkib','green','Spirtsiz, shakarsiz, boʻyoqsiz, glyutensiz. Taʼmlari: malina, uzum, banan, apelsin, karamel, gilos.'],
          ['Aniq doza','orange','Oʻrnatilgan pipetka yangi tugʻilgan chaqaloqlarda ham aniq doza berish imkonini beradi.'],
          ['Kanada sifati','red','Made in Canada, Produits du Québec. Har bir mahsulotda Health Canada bergan DIN-HM raqami bor.']],
    lineEyebrow: 'Liniya',
    lineTitle: 'Alomat boʻyicha tanlang',
    lineText: 'Har bir vosita bitta emas, alomatlar majmuasiga qaratilgan.',
    allProducts: function(n){ return 'Barcha '+n+' ta mahsulot →'; },
    pharmEyebrow: 'Farmatsevtlarga',
    pharmTitle: 'Liniyani 10 daqiqada oʻzlashtiring',
    pharmText: 'Tarkiblar, dozalash va tavsiya qilish holatlari boʻyicha qisqa oʻz-oʻzini tekshirish testi. Toʻliq bilim marafoni alohida platformada.',
    pharmCta: 'Testni boshlash'
  },

  catalog: {
    eyebrow: 'Kids 0-9 liniyasi',
    title: 'Mahsulotlar',
    text: 'Barchasi tugʻilgandan 9 yoshgacha. Alomat boʻyicha filtrlang.',
    all: 'Barchasi',
    empty: 'Bu alomat boʻyicha mahsulot topilmadi.'
  },
  /* katalog filtrlari: [kalit (config.js'dagi cats), nomi] */
  cats: [['tumov','Tumov va burun'],['yotal','Yoʻtal'],['isitma','Isitma va ogʻriq'],['allergiya','Allergiya'],
         ['gripp','Gripp'],['sanchiq','Sanchiq'],['tish','Tish chiqishi'],['tomoq','Tomoq'],['uyqu','Uyqu va asab']],

  product: {
    addToCart: 'Savatga qoʻshish',
    official: 'Ishlab chiqaruvchining rasmiy sahifasi:',
    comp: function(n){ return 'Tarkibi — '+n+' ta komponent'; },
    dose: 'Dozalash',
    doseNote: 'Qadoqdagi koʻrsatmaga amal qiling. Ikkilanayotgan boʻlsangiz — farmatsevt yoki shifokordan soʻrang.',
    about: 'Nima uchun kerak',
    vs: 'Farqi:',
    warn: 'Eʼtibor:',
    note: 'Anʼanaviy gomeopatik manbalarga asoslangan. Health Canada DIN-HM roʻyxatidan oʻtgan.',
    others: 'Liniyaning boshqa vositalari'
  },

  where: {
    eyebrow: 'Sotuv nuqtalari',
    title: 'Qayerdan olish mumkin',
    text: 'Kids 0-9 hamkor dorixonalarda mavjud. Roʻyxatda dorixonangizni koʻrmadingizmi — bizga yozing, qoʻshamiz.',
    allCities: 'Barcha shaharlar',
    missTitle: 'Dorixonada topilmadimi?',
    missText: 'Toʻgʻridan-toʻgʻri buyurtma bering — yetkazib berish shartlarini menejer aytadi.',
    order: 'Buyurtma berish'
  },

  order: {
    eyebrow: 'Buyurtma',
    title: 'Savat va aloqa maʼlumotlari',
    text: 'Buyurtmani yuborganingizdan soʻng menejer narx, mavjudlik va yetkazib berish boʻyicha bogʻlanadi.',
    empty: 'Savat hozircha boʻsh.',
    emptyLink: 'Mahsulotlarni koʻring',
    remove: 'Olib tashlash',
    addMore: '+ Yana mahsulot qoʻshish',
    f:  { name:'Ism-familiya', phone:'Telefon', city:'Shahar', type:'Kim sifatida', addr:'Manzil yoki dorixona nomi', note:'Izoh' },
    ph: { name:'Nilufar Karimova', addr:'Chilonzor tumani, 12-uy', note:'Qoʻshimcha savol yoki soʻrov' },
    types: ['Ota-ona', 'Dorixona / farmatsevt', 'Distribyutor'],
    sendTg: 'Telegram orqali yuborish',
    copy: 'Matnni nusxalash',
    hint: 'Buyurtma matni tayyorlanadi va tanlangan ilovada ochiladi — yuborishdan oldin uni koʻrib chiqishingiz mumkin.',
    msgTitle: 'Kids 0-9 — yangi buyurtma',
    msgNone: '• (mahsulot tanlanmagan)',
    copied: 'Buyurtma matni nusxalandi',
    copyFail: 'Nusxalab boʻlmadi',
    copyNA: 'Nusxalash bu brauzerda ishlamaydi'
  },

  pharm: {
    eyebrow: 'Farmatsevtlarga',
    title: 'Liniyani bilib olish va tavsiya qilish',
    text: 'Qisqa oʻz-oʻzini tekshirish testi. Har bir savoldan keyin izoh chiqadi.',
    q: 'Savol',
    correct: 'toʻgʻri javob',
    good: 'Liniyani yaxshi bilasiz. Toʻliq marafonda bosqichlarni topshirishingiz mumkin.',
    bad: 'Mahsulot sahifalarini koʻrib chiqing va testni qayta oʻting.',
    restart: 'Qaytadan',
    marathon: 'Toʻliq bilim marafoni',
    why: 'Izoh.',
    next: 'Keyingi savol',
    result: 'Natijani koʻrish',
    tipsTitle: 'Suhbatda nimaga tayaning',
    tips: ['Liniyaning kuchli tomoni — <b>yosh chegarasi</b> (0 yoshdan), <b>tarkib</b> (spirtsiz, shakarsiz, boʻyoqsiz) va <b>doza aniqligi</b> (oʻrnatilgan pipetka).',
           'Mahsulotni shifokor tayinlagan davolash oʻrniga emas, unga qoʻshimcha sifatida taklif qiling. Yuqori harorat, nafas qisilishi yoki uzoq davom etayotgan alomatlarda — mijozni shifokorga yoʻnaltiring.'],
    mTitle: 'Bilim marafoni',
    mText: 'Bosqichli test platformasi: filiallar kesimida reyting, natijalar eksporti va admin paneli.',
    mCta: 'Marafonni ochish'
  },

  company: {
    eyebrow: 'Homeocan Inc.',
    title: '1987-yildan beri Monreal, Kvebek',
    text: 'Kanadaning gomeopatik vositalar ishlab chiqaruvchisi. Asoschi — farmatsevt Michèle Boisvert, Université de Montréal.',
    cards: [['Ishlab chiqarish','blue','23 000+ kv.fut maydon, 6 ta laminar boks.'],
            ['Tartibga solish','green','DIN-HM (Health Canada), Homeolab USA FDA roʻyxatida.'],
            ['Geografiya','orange','13+ mamlakat, Kanadada 3 000+ chakana savdo nuqtasi.'],
            ['Brendlar','purple','Kids 0-9, Traumacare, Homeocoksinum, Essencia, Le Petit Prince.']],
    lineTitle: 'Kids 0-9 liniyasi',
    lineText: function(n){ return 'Kanadadagi toʻliq liniya siroplar, tomchi eritmalar, unit-doza shakllari va Le Petit Prince seriyasini oʻz ichiga oladi. Oʻzbekistonda hozircha '+n+' ta pozitsiya taqdim etilgan.'; },
    catalogLink: 'Kanadadagi katalog ↗',
    makerTitle: 'Ishlab chiqaruvchi',
    address: '5655 Rue De Marseille, Montreal, Quebec, H1N 1J4, Kanada',
    tel: 'Tel'
  },

  safety: {
    eyebrow: 'Xavfsizlik',
    title: 'DIN-HM, tarkib va chegaralar',
    blocks: [['DIN-HM nima?', 'Kanada Sogʻliqni saqlash vazirligi (Health Canada) tomonidan beriladigan identifikatsiya raqami. U mahsulotning xavfsizligi va sifati boʻyicha talablarga javob berishini va Kanadada sotish uchun qonuniy ruxsat etilganini bildiradi.'],
             ['Tarkibda nima yoʻq', 'Spirt, shakar, sunʼiy boʻyoq va glyuten yoʻq. Bu chaqaloqlar va allergiyaga moyil bolalarda qoʻllashni osonlashtiradi.'],
             ['Halol chegara', 'Kids 0-9 anʼanaviy gomeopatik manbalarga asoslangan. Vositalar shifokor tayinlagan davolashning, antibiotiklarning yoki haroratni tushiruvchi dorilarning oʻrnini bosmaydi va tashxis qoʻyish vazifasini bajarmaydi.']],
    warn: '<b>Zudlik bilan shifokorga murojaat qiling:</b> 3 oygacha chaqaloqda harorat 38 °C dan yuqori boʻlsa; nafas olish qiyinlashsa yoki tezlashsa; bola hushidan ketsa, letargik boʻlsa yoki toʻxtovsiz yigʻlasa; teridagi toshma bosilganda oqarmasa; suvsizlanish belgilari boʻlsa; alomatlar 2–3 kun ichida yaxshilanmasa.'
  },

  contact: {
    eyebrow: 'Aloqa',
    title: 'Savolingiz bormi?',
    text: 'Ota-onalar, dorixonalar va distribyutorlar uchun bitta kanal.',
    phone: 'Telefon',
    email: 'E-pochta',
    city: 'Shahar',
    faq: [['Mahsulotni qaysi yoshdan berish mumkin?', 'Liniyadagi barcha vositalar tugʻilgandan boshlab ruxsat etilgan. Dozalash yoshga qarab farq qiladi — mahsulot sahifasidagi koʻrsatmani oʻqing.'],
          ['Boshqa dorilar bilan birga berish mumkinmi?', 'Odatda ha, lekin bola doimiy davolanishda boʻlsa yoki bir vaqtda bir nechta vosita berilayotgan boʻlsa — avval shifokor bilan maslahatlashing.'],
          ['Nechchi kun berish kerak?', 'Alomatlar yengillashguncha. Agar 2–3 kun ichida yaxshilanish boʻlmasa yoki holat ogʻirlashsa — qabulni davom ettirmasdan shifokorga murojaat qiling.'],
          ['Dorixonam uchun qanday buyurtma beraman?', 'Savatga mahsulotlarni qoʻshing va buyurtma sahifasida «Dorixona / farmatsevt» ni tanlang — menejer shartlar boʻyicha bogʻlanadi.']]
  }
},

/* ---------- mahsulot matnlari (kalit = config.js'dagi slug) ---------- */
products: {
  "sinus": {
    sub: "Sinusit va tumov",
    form: "Peroral tomchilar",
    vol: "25 ml",
    flavor: "Malina",
    age: "0 yoshdan",
    tags: ["tumov","burun bitishi","shamollash"],
    lead: "Shamollash vaqtidagi sinusit alomatlari: tumov, aksirish, koʻzdan yosh oqishi, tomoq taʼsirlanishi, bosh ogʻriqlari.",
    desc: "Burun bitishi va tumovning butun majmuasi uchun — bir vaqtning oʻzida ajralmalar, aksirish va bosh ogʻrigʻiga qaratilgan.",
    about: "Chaqaloqlarda burunning bitib qolishi nafas olish, emish va uyquni buzadi. Tomir toraytiruvchi tomchilarning qoʻllanilish muddati taxifilaksiya va medikamentoz rinit xavfi tufayli qatʼiy cheklangan (odatda 3–5 kun). Sinus — shilliq qavatni quritmaydigan, malina taʼmli tizimli muqobil.",
    vs: "Nafazolin va ksilometazolin 6 yoshgacha bolalarda taxikardiya va tez koʻnikish (rebound) berishi mumkin. Sinus alomatlar majmuasiga qaratilgan va qoʻllanish muddati boʻyicha shunday cheklovga ega emas.",
    dose: ["15 tomchi (1 pipetka = 0,75 ml) kuniga 1–3 marta.","Oʻtkir xurujda: 15 tomchi, 15 daqiqa oraligʻida yana 2 marta. Alomatlar qaytganda kuniga 9 martagacha."],
    comp: [
      ["Pulsatilla X8","Oʻtloq prostreli","Quyuq sariq-yashil ajralmalar, burun bitishi"],
      ["Allium cepa X6","Piyoz","Suvli tumov, shilliq qavat tirnashi"],
      ["Arsenicum album X8","Oq margimush","Kuydiruvchi ajralmalar, tomoq tirnashi"],
      ["Nux vomica X6","Chilibuxa","Burun bitishi, bosh ogʻrigʻi"],
      ["Euphrasia X6","Dorivor ochanka","Koʻzning achishishi"],
      ["Sabadilla X6","Sabadilla","Xurujsimon aksirish"],
      ["Aralia racemosa X6","Shingilsimon araliya","Pichan isitmasi, astmatik yoʻtal"],
      ["Cuprum metallicum X8","Metall mis","Koʻz, burun va tomoqning spazmi va qichishishi"]
    ]
  },
  "all-allergies": {
    sub: "Allergiyaning barcha turlari",
    form: "Peroral tomchilar",
    vol: "25 ml",
    flavor: "Banan",
    age: "0 yoshdan",
    tags: ["allergiya","aksirish","koʻz qichishishi"],
    lead: "Mavsumiy allergiya: aksirish, burun bitishi, tomoq va teri taʼsirlanishi, koʻzdan yosh oqishi, koʻzlarning qichishishi.",
    desc: "Mavsumiy (gulchang) va yil davomidagi (uy changi, hayvon juni) allergenlarga qarshi — uyquchanlik keltirmaydi.",
    about: "Preparat mavsumiy va yil davomidagi allergenlarga qarshi qoʻllash uchun moʻljallangan. Bu klassik antigistaminlarning uyquchanlik keltiruvchi taʼsiridan qochish imkonini beradi. Muhim: allergik rinitni bakterial yoki virusli sinusit bilan chalkashtirmaslik kerak — shubha boʻlsa, shifokor koʻrigidan oʻtkazing.",
    vs: "Tsetirizin va loratadin baʼzi bolalarda paradoksal qoʻzgʻaluvchanlik, difengidramin esa sedatsiya berishi mumkin. All Allergies bu taʼsirlarga ega emas.",
    dose: ["15 tomchi kuniga 3 marta.","Oʻtkir krizda: 15 tomchi har 15 daqiqada, 4 martagacha."],
    comp: [
      ["Pulsatilla D8","Prostrel","Quyuq ajralmalar, allergik rinit"],
      ["Allium cepa D6","Piyoz","Suvli tumov, burun tirnashi"],
      ["Arsenicum album D8","Margimush angidridi","Kuydiruvchi ajralmalar, tomoq tirnashi"],
      ["Nux vomica D6","Chilibuxa","Burun bitishi, bosh ogʻrigʻi"],
      ["Euphrasia D6","Ochanka","Koʻzlarning achishishi va yoshlanishi"],
      ["Sabadilla D6","Chevadilla","Xurujsimon aksirish"],
      ["Sticta pulmonaria D6","Eman medunitsasi","Burun shilliq qavatlarining qurishishi"],
      ["Aralia racemosa D6","Shingilsimon araliya","Pichan isitmasi, tungi yoʻtal"],
      ["Cuprum metallicum D8","Mis","Spazmlar, tirishish holatlari"]
    ]
  },
  "pain-fever": {
    sub: "Ogʻriq va isitma",
    form: "Peroral tomchilar",
    vol: "25 ml",
    flavor: "Gilos",
    age: "0 yoshdan",
    tags: ["isitma","ogʻriq","tish ogʻrigʻi","bosh ogʻrigʻi"],
    lead: "Haroratni tushirishga yordam beradi, ogʻriqni yengillashtiradi: angina, bosh ogʻrigʻi, tish ogʻrigʻi, umumiy ogʻriq sezgisi.",
    desc: "Isitma va ogʻriq paytida antipiretiklarga qoʻshimcha — ularning oʻrniga emas, ular bilan birga qoʻllash uchun.",
    about: "Isitma va ogʻriq — pediatriyada dori qoʻllashning eng koʻp uchraydigan sababi. Pain and Fever komplementar vosita sifatida — allopatik antipiretiklar qabullari oʻrtasidagi oraliqlarda mushak va bosh ogʻriqlarini yumshatish uchun qoʻllaniladi.",
    vs: "Paratsetamolni dozadan oshirib yuborish jigarga zarar yetkazadi, ibuprofen esa suvchechakda tavsiya etilmaydi. Pain & Fever bu xavflarni tugʻdirmaydi — lekin u haroratni tushiruvchi dorining oʻrnini bosmaydi.",
    warn: "Bolangizning harorati 39 °C dan oshsa, 3 kundan ortiq davom etsa yoki bola holsiz, letargik boʻlsa — shifokorga murojaat qiling. 3 oygacha chaqaloqda 38 °C — tez yordam chaqirish uchun asos.",
    dose: ["Alomatlar paydo boʻlganda 15 tomchi, kuniga 3 marta.","Holat yaxshilanganda dozani kamaytiring."],
    comp: [
      ["Arnica montana 8X","Togʻ arnikasi","Mushak ogʻrigʻi va tomoqdagi ogʻriq"],
      ["Atropa belladonna 8X","Belladonna","Yuqori harorat, pulsatsiyalanuvchi ogʻriq"],
      ["Ferrum phosphoricum 8X","Temir fosfati","Yalligʻlanishning boshlangʻich bosqichi, oʻrtacha isitma"],
      ["Hypericum perforatum 8X","Teshik barg dalachoyi","Nevralgik ogʻriq va tish ogʻrigʻi"],
      ["Ledum palustre 8X","Botqoq bagʻuligi","Yalligʻlanish va titroq"],
      ["Thuja occidentalis 8X","Gʻarbiy tuya","Surunkali yalligʻlanish holatlari"]
    ]
  },
  "colic": {
    sub: "Qorin sanchigʻi",
    form: "Peroral tomchilar",
    vol: "25 ml",
    flavor: "Malina",
    age: "0 yoshdan",
    tags: ["sanchiq","gaz","koʻngil aynishi"],
    lead: "Abdominal sanchiq, gaz hosil boʻlishi, koʻngil aynishi, kekirish, spazmlar, tajanglik.",
    desc: "Chaqaloq sanchiqlarida — gazga ham, spazmga ham qaratilgan tarkib. Pipetka yangi tugʻilganlar uchun qulay.",
    about: "Chaqaloq sanchiqlari hayotning birinchi oylarida ota-onalar uchun eng charchatuvchi holatlardan biri. Sabablari koʻp omilli: fermentlar yetilmaganligi, silliq mushaklar spazmi, aerofagiya. Simetikon faqat koʻpikni tarqatadi, ogʻriqning spastik komponentiga taʼsir qilmaydi.",
    vs: "Colic tarkibidagi Colocynthis va Magnesia phosphorica — anʼanaviy gomeopatiyada antispastik juftlik hisoblanadi, yaʼni vosita gaz bilan birga spazmga ham qaratilgan.",
    warn: "Chaqaloq toʻxtovsiz yigʻlasa, qusish, qon aralash najas, harorat yoki vazn ortishining toʻxtashi kuzatilsa — bu sanchiq emas. Zudlik bilan shifokorga koʻrsating.",
    dose: ["Ogʻriqda: 15 tomchi har 15 daqiqada, 4 martagacha.","Maksimum kuniga 12 doza."],
    comp: [
      ["Colocynthis 6X","Kolotsint","Abdominal spazmlar, bosim va bukilishdan yaxshilanish"],
      ["Magnesia phosphorica 10X","Magniy fosfati","Ichak shishi, sanchiq"],
      ["Chamomilla 6X","Dorivor romashka","Koʻngil aynishi, tajanglik, bezovtalik"],
      ["Dioscorea villosa 6X","Yovvoyi yams","Meteorizm, tarang holatda yaxshilanadigan ogʻriqlar"]
    ]
  },
  "teething": {
    sub: "Tish chiqishi",
    form: "Peroral tomchilar",
    vol: "25 ml",
    flavor: "Apelsin",
    age: "0 yoshdan",
    tags: ["tish chiqishi","milk ogʻrigʻi","injiqlik"],
    lead: "Tish chiqish paytida milk ogʻrigʻi, tajanglik, qoʻzgʻalish.",
    desc: "Sut tishlari chiqayotgan davr uchun — milk gellariga peroral muqobil.",
    about: "Sut tishlarining chiqishi (3–15 oy) koʻpincha milklar yalligʻlanishi, injiqlik va uyqu buzilishi bilan kechadi. Lidokain yoki benzokainli gellar yutilganda toksik taʼsir berishi mumkin, shuning uchun ularning kichik yoshdagi bolalarda qoʻllanishi cheklangan.",
    vs: "FDA 2 yoshgacha bolalarda lidokainli gellar xavfi haqida ogohlantirgan (metgemoglobinemiya), benzokainli gellar ham cheklangan. Teething — peroral, gelsiz muqobil.",
    dose: ["Oʻtkir faza: 15 tomchi har 15 daqiqada, 4 martagacha.","Zoʻrayishdan tashqari: 15 tomchi kuniga 3 marta."],
    comp: [
      ["Chamomilla 5CH","Dorivor romashka","Tajanglik, injiqlik"],
      ["Arnica montana 5CH","Togʻ arnikasi","Milklar ogʻrigʻi va shishi"],
      ["Borax 5CH","Natriy borati","Aftoz stomatit, milklar yalligʻlanishi"],
      ["Hypericum perforatum 5CH","Teshik barg dalachoyi","Oʻtkir nevralgik ogʻriq"]
    ]
  },
  "homeocoksinum": {
    sub: "Gripp belgilarida",
    form: "Peroral eritma",
    vol: "25 ml",
    flavor: "Malina",
    age: "0 yoshdan",
    tags: ["gripp","shamollash","isitma"],
    lead: "Grippning boshlanishi: isitma, titroq, aʼzolar ogʻrigʻi, tumov, holsizlik.",
    desc: "Shamollashning birinchi belgilarida — dastlabki soatlarda qoʻllash uchun moʻljallangan.",
    about: "Homeocoksinum rivojlangan klinik manzarani emas, prodromal davrni — birinchi soatlarni nishonga oladi: toʻsatdan isitma, titroq, mushak va boʻgʻin ogʻriqlari, kuchaygan holsizlik.",
    vs: "Anas barbariae asosidagi eng koʻp tarqalgan gomeopatik formulaning analogi. Spirtsiz, emizikli chaqaloqlar uchun ham mos.",
    dose: ["Alomatlar paydo boʻlganda 15 tomchi.","24 soat davomida har 8 soatda takrorlang."],
    comp: [
      ["Anas barbariae hepatis et cordis extractum 200C","Oʻrdak jigari va yuragi avtolizati","Grippga oʻxshash alomatlarning boshlanishi"]
    ]
  },
  "flu-buster": {
    sub: "Sublingval granulalar",
    form: "Sublingval granulalar",
    vol: "12 ta tuba",
    flavor: "Neytral",
    age: "0 yoshdan",
    tags: ["gripp","shamollash","yoʻlga qulay"],
    lead: "Grippning boshlanishi: isitma, titroq, aʼzolar ogʻrigʻi, tumov, holsizlik.",
    desc: "Homeocoksinum formulasining tuba shakli — til ostiga sepiladi, suv talab qilmaydi.",
    about: "Tomchilar bilan bir xil formula, lekin bir martalik tubalarda: sumkada, bogʻchada yoki safarda olib yurish uchun qulay. Til ostiga sepiladi va oʻz-oʻzidan eriydi.",
    vs: "Suv, qoshiq yoki oʻlchov talab qilmaydi — shamollashning birinchi belgisi paydo boʻlgan joyda darhol qoʻllash mumkin.",
    dose: ["Alomatlar paydo boʻlganda 1 tuba til ostiga.","24 soat davomida har 8 soatda takrorlang."],
    comp: [
      ["Anas barbariae hepatis et cordis extractum 200C","Oʻrdak jigari va yuragi avtolizati","Grippga oʻxshash alomatlarning boshlanishi"]
    ]
  },
  "calm": {
    sub: "Tinchlantiruvchi sirop",
    form: "Sirop",
    vol: "100 ml",
    flavor: "Uzum",
    age: "0 yoshdan",
    tags: ["uyqu","bezovtalik","giperfaollik"],
    lead: "Asabiylik, bezovtalik, qoʻzgʻalish, uxlay olmaslik muammolari, giperfaollik.",
    desc: "Bogʻcha yoki maktabga moslashish davri, tungi qoʻrquvlar va uyqu buzilishlarida.",
    about: "Haddan ziyod maʼlumot oqimi, bogʻcha yoki maktabga moslashish stressi, yosh inqirozlari oʻtkinchi xulq-atvor oʻzgarishlariga olib keladi: qoʻzgʻaluvchanlikning oshishi, uyquga ketishning qiyinlashuvi. Calm kunduzgi uyquchanlik keltirmasdan yumshoq tinchlantirish uchun moʻljallangan.",
    vs: "Retseptli psixotrop vositalar bunday oʻtkinchi holatlarda oqlanmaydi. Calm — bekor qilish sindromi xavfisiz yumshoq yechim.",
    warn: "Xulq-atvor oʻzgarishi bir necha haftadan ortiq davom etsa yoki bolaning rivojlanishiga taʼsir qilsa — pediatr yoki bolalar psixologiga murojaat qiling.",
    dose: ["0–5 yosh: ½ choy qoshiq (2,5 ml) kuniga 3–4 marta.","6–9 yosh: 1 choy qoshiq (5 ml) kuniga 3–4 marta."],
    comp: [
      ["Asa foetida 8X","Asafetida","Asabiy qoʻzgʻalish, isterik holatlar"],
      ["Ignatia amara 8X","Achchiq ignatsiya","Emotsional beqarorlik"],
      ["Valeriana officinalis 8X","Dorivor valeriana","Uyqusizlik, tungi qoʻrquvlar"],
      ["Argentum nitricum 8X","Kumush nitrati","Xavotirlanish, voqealardan qoʻrqish"],
      ["Avena sativa 8X","Ekilgan suli","Harakat bezovtaligi, giperfaollik"],
      ["Stramonium 8X","Oddiy bangdevona","Tungi qoʻrquvlar, qorongʻulikdan qoʻrqish"],
      ["Hyoscyamus niger 8X","Qora mingdevona","Sedativ va tirishuvga qarshi taʼsir"],
      ["Paeonia officinalis 8X","Dorivor pion","Yalligʻlanishga va spazmga qarshi taʼsir"],
      ["Cocculus indicus 8X","Kokkulyus indikus","Bosh aylanishi, bosh ogʻriqlari, koʻngil aynishi"]
    ]
  },
  "throat-ease": {
    sub: "Tomoq uchun sirop",
    form: "Sirop",
    vol: "100 ml",
    flavor: "Karamel",
    age: "0 yoshdan",
    tags: ["tomoq ogʻrigʻi","xirillash","yutish qiyinligi"],
    lead: "Tomoq ogʻrigʻi: achishish, yutishda qiyinlik, ovoz xirillashi, taʼsirlanish, qizarish.",
    desc: "Spreylar va soʻriladigan tabletkalarga peroral muqobil — ovqatdan bosh tortayotgan bolalar uchun ham.",
    about: "Kichik yoshdagi bolalarda ogʻiz-tomoq yalligʻlanishlari qiyin vazifa: antiseptik spreylar achishish va laringospazm xavfini tugʻdiradi, soʻriladigan tabletkalar esa aspiratsiya xavfi tufayli tavsiya etilmaydi.",
    vs: "Chaqaloqlarda spreylar laringospazmni keltirib chiqarishi mumkin, 4 yoshgacha bolalar ledenetslar bilan boʻgʻilib qolishi mumkin. Throat Ease — karamel taʼmli, yutish oson shakl.",
    warn: "Tomoqda oq karash, 38,5 °C dan yuqori harorat yoki yutishning keskin qiyinlashuvi — streptokokk infektsiyasi belgisi boʻlishi mumkin. Shifokor koʻrigi shart.",
    dose: ["0–6 yosh: ½ choy qoshiq kuniga 3 marta.","7–9 yosh: 1 choy qoshiq kuniga 3 marta. Holat yaxshilanganda dozani kamaytiring."],
    comp: [
      ["Arsenicum album 8X","Oq margimush","Achishish va yutishda qiyinchilik"],
      ["Mercurius solubilis 8X","Eruvchan simob","Bodomcha bezlarining yalligʻlanishi"],
      ["Hepar sulphuris 8X","Gepar sulfuris","Qurib qolishi va yutganda noqulaylik hissi"],
      ["Arum triphyllum 8X","Uch bargli aronnik","Kuchli xirillash, ovozni yoʻqotish"],
      ["Kali phosphoricum 8X","Kaliy fosfati","Kasallik paytidagi holsizlik"],
      ["Natrum sulphuricum 8X","Natriy sulfati","Shilliq qavat shishi"]
    ]
  },
  "day-syrup": {
    sub: "Kunduzgi yoʻtal siropi",
    form: "Sirop",
    vol: "100 ml",
    flavor: "Yumshoq",
    age: "0 yoshdan",
    tags: ["yoʻtal","shamollash","balgʻam"],
    lead: "Yoʻtal, shamollash, gripp, burun bitishi, shilimshiq, aʼzolar ogʻrigʻi, isitma.",
    desc: "Quruq va hoʻl yoʻtaldan burun bitishigacha — kunduzi uyquchanlik keltirmaydi.",
    about: "Oʻtkir respirator infektsiyalar — pediatrik murojaatlarning asosiy sababi. Day Syrup alomatlarning keng doirasiga qaratilgan: quruq va hoʻl yoʻtal, burun bitishi, mushak ogʻriqlari — sedativ taʼsirsiz.",
    vs: "Chaqaloqlarda bronxoreya xavfi yoʻq (ambroksoldan farqli) va nafas olish markazini bostirmaydi (tizimli yoʻtalga qarshi vositalardan farqli).",
    warn: "Yoʻtal 2 haftadan ortiq davom etsa, hushtaksimon nafas, nafas qisilishi yoki qon aralash balgʻam kuzatilsa — shifokorga murojaat qiling.",
    dose: ["0–6 yosh: ½ choy qoshiq har 4 soatda.","7–9 yosh: 1 choy qoshiq har 4 soatda. Holat yaxshilanganda chastotani kamaytiring."],
    comp: [
      ["Drosera rotundifolia 1CH","Dumaloq bargli rosyanka","Quruq spazmatik, koʻkyoʻtalga oʻxshash yoʻtal"],
      ["Arnica montana 3CH","Togʻ arnikasi","Tanadagi ogʻriq, mushak ogʻrigʻi"],
      ["Bryonia alba 3CH","Oq briyoniya","Quruq yoʻtal"],
      ["Ipecacuanha 3CH","Ipekakuana","Koʻngil aynishi bilan birga hoʻl yoʻtal"],
      ["Belladonna 3CH","Belladonna","Toʻsatdan isitma, qizarish"],
      ["Coccus cacti 3CH","Koxen kaktuslari","Yopishqoq balgʻamli spazmatik yoʻtal"],
      ["Cetraria islandica 1CH","Islandiya moxi","Quruq, taʼsirlantiruvchi yoʻtalni yengillashtirish"],
      ["Stannum metallicum 3CH","Metall qalay","Koʻp balgʻamli nafas yoʻllari kasalliklarida"]
    ]
  }
},

/* ---------- dorixonalar (namunaviy) ---------- */
pharmacies: [
  {"name":"Dori-Darmon, Chilonzor filiali","city":"Toshkent","addr":"Chilonzor tumani, Bunyodkor shoh koʻchasi","phone":"+998 71 000 00 01"},
  {"name":"Oxymed Pharm, Yunusobod","city":"Toshkent","addr":"Yunusobod tumani, Amir Temur shoh koʻchasi","phone":"+998 71 000 00 02"},
  {"name":"Vita Farm, Mirzo Ulugʻbek","city":"Toshkent","addr":"Mirzo Ulugʻbek tumani, Mustaqillik shoh koʻchasi","phone":"+998 71 000 00 03"},
  {"name":"Shifo Apteka, Samarqand markaz","city":"Samarqand","addr":"Registon koʻchasi","phone":"+998 66 000 00 04"},
  {"name":"Salomat Farm, Buxoro","city":"Buxoro","addr":"Muminov koʻchasi","phone":"+998 65 000 00 05"},
  {"name":"Farmaland, Namangan","city":"Namangan","addr":"Navoiy koʻchasi","phone":"+998 69 000 00 06"}
],

/* ---------- farmatsevtlar uchun qisqa test: a — toʻgʻri variant indeksi (0 dan) ---------- */
quiz: [
  {"q":"Kids 0-9 liniyasi qaysi yoshdan qoʻllanadi?","o":["6 oydan","2 yoshdan","Tugʻilgandan (0 yosh)","3 yoshdan"],"a":2,"why":"Liniyaning asosiy afzalligi — barcha mahsulotlar tugʻilgandan boshlab ruxsat etilgan."},
  {"q":"Chaqaloqda burun bitishi bilan kelgan onaga tomir toraytiruvchi tomchilar oʻrniga nimani taklif qilasiz?","o":["Sinus","Colic","Calm","Throat Ease"],"a":0,"why":"Sinus tumov, burun bitishi va bosh ogʻrigʻi majmuasiga qaratilgan va shilliq qavatni quritmaydi."},
  {"q":"Colic tarkibidagi klassik antispastik juftlik qaysi?","o":["Arnica va Belladonna","Colocynthis va Magnesia phosphorica","Pulsatilla va Euphrasia","Borax va Chamomilla"],"a":1,"why":"Aynan shu juftlik gaz emas, spazm komponentiga qaratilgan."},
  {"q":"Pain & Fever qanday oʻrinda tavsiya qilinadi?","o":["Antipiretik oʻrniga","Antipiretiklarga komplementar vosita sifatida","Faqat antibiotik bilan","Faqat 6 yoshdan"],"a":1,"why":"U haroratni tushiruvchi dorining oʻrnini bosmaydi — qabullar orasidagi oraliqlarda qoʻshimcha sifatida qoʻllanadi."},
  {"q":"FDA 2 yoshgacha bolalarda nima haqida ogohlantirgan?","o":["Malina taʼmi haqida","Lidokainli milk gellari haqida","Sirop shakli haqida","Pipetka haqida"],"a":1,"why":"Metgemoglobinemiya xavfi. Teething — peroral muqobil."},
  {"q":"DIN-HM raqami nimani anglatadi?","o":["Kanadada roʻyxatdan oʻtgan gomeopatik vosita ID raqami","Shtrix-kod","Seriya raqami","Ishlab chiqarish sanasi"],"a":0,"why":"DIN-HM — Health Canada tomonidan berilgan identifikatsiya raqami."},
  {"q":"Homeocoksinum qachon qoʻllanadi?","o":["Kasallikning 5-kunida","Prodromal — birinchi belgilar paydo boʻlgan soatlarda","Faqat sogʻayganidan keyin","Faqat allergiyada"],"a":1,"why":"Formula rivojlangan manzara emas, boshlangʻich soatlar uchun moʻljallangan."},
  {"q":"Kids 0-9 tarkibida nimalar YOʻQ?","o":["Spirt, shakar, boʻyoq, glyuten","Faqat shakar","Faqat boʻyoq","Hech qanday cheklov yoʻq"],"a":0,"why":"Toza tarkib liniyaning asosiy sotuv argumentlaridan biri."}
]
};
