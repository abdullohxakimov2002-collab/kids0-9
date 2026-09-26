/* =======================================================================
   SOZLAMALAR — UZ va RU sahifalar uchun UMUMIY.
   Telefon, Telegram, mahsulot rasmi yoki ranglarini shu yerda bir marta
   o'zgartirasiz — ikkala til ham avtomatik yangilanadi.
   Bu faylni o'zgartirsangiz, HTML'dagi ?v= versiyasini oshiring.
   ======================================================================= */
var CONFIG = {
  phone:       '+998 90 000 00 00',
  telegram:    'kids09uz',        // t.me/... foydalanuvchi nomi
  whatsapp:    '998900000000',    // faqat raqamlar
  email:       'info@kids09.uz',
  marathonUrl: '/bilim-marafoni'  // to'liq bilim marafoni testi
};

/* Tillar: kod → sahifa prefiksi. Yangi til qo'shsangiz shu yerga yozing,
   public/<kod>/index.html va assets/js/i18n/<kod>.js yarating. */
var LANGS = [
  { code: 'uz', base: '',    label: 'UZ' },
  { code: 'ru', base: '/ru', label: 'RU' }
];

/* =======================================================================
   MAHSULOTLAR — tilga bog'liq bo'lmagan maydonlar.
   Tartib shu yerda belgilanadi (bosh sahifa va katalogda shu tartibda).
   slug  — URL qismi (/mahsulot/<slug>), i18n fayllardagi kalit ham shu.
   img   — /public/images/ ichidagi rasm (bo'sh qolsa rangli "0-9" chiqadi).
   color — :root'dagi rang nomi (blue, green, yellow, teal, pink, lilac, red, purple, orange).
   cats  — katalog filtrlari (i18n fayldagi `cats` kalitlari).
   ======================================================================= */
var PRODUCTS = [
  { slug: 'sinus',         name: 'Sinus',                    color: 'green',  cats: ['tumov', 'gripp'],
    img: '/images/sinus.webp',         src: 'https://homeocan.ca/en/collections/kids-0-9/products/sinus-oral-solution-25-ml-kids-0-9' },
  { slug: 'all-allergies', name: 'All Allergies',            color: 'yellow', cats: ['allergiya'],
    img: '/images/all-allergies.webp', src: 'https://homeocan.ca/en/collections/kids-0-9/products/all-allergies-25-ml-kids-0-9' },
  { slug: 'pain-fever',    name: 'Pain & Fever',             color: 'teal',   cats: ['isitma'],
    img: '/images/pain-fever.webp',    src: 'https://homeocan.ca/en/collections/kids-0-9/products/pain-fever-25-ml-kids-0-9' },
  { slug: 'colic',         name: 'Colic',                    color: 'pink',   cats: ['sanchiq'],
    img: '/images/colic.webp',         src: 'https://homeocan.ca/en/collections/kids-0-9/products/colic-25-ml-kids-0-9' },
  { slug: 'teething',      name: 'Teething',                 color: 'lilac',  cats: ['tish'],
    img: '/images/teething.webp',      src: 'https://homeocan.ca/en/collections/kids-0-9/products/teething-25-ml-kids-0-9' },
  { slug: 'homeocoksinum', name: 'Homeocoksinum',            color: 'red',    cats: ['gripp', 'isitma'],
    img: '/images/homeocoksinum.webp', src: 'https://homeocan.ca/en/collections/kids-0-9/products/homeocoksinum-oral-solution-25-ml-kids-0-9' },
  { slug: 'flu-buster',    name: 'Homeocoksinum Flu Buster', color: 'red',    cats: ['gripp'],
    img: '/images/flu-buster.webp',    src: 'https://homeocan.ca/en/collections/kids-0-9' },
  { slug: 'calm',          name: 'Calm',                     color: 'purple', cats: ['uyqu'],
    img: '/images/calm.webp',          src: 'https://homeocan.ca/en/collections/kids-0-9/products/calm-syrup-100-ml-kids-0-9' },
  { slug: 'throat-ease',   name: 'Throat Ease',              color: 'red',    cats: ['tomoq'],
    img: '/images/throat-ease.webp',   src: 'https://homeocan.ca/en/collections/kids-0-9/products/throat-ease-syrup-kids-0-9' },
  { slug: 'day-syrup',     name: 'Day Syrup',                color: 'green',  cats: ['yotal', 'tumov'],
    img: '/images/day-syrup.webp',     src: 'https://homeocan.ca/en/collections/kids-0-9/products/day-syrup-kids-0-9-homeocan' }
];
