/* ═══════════════════════════════════════════════════════════════
   ⚙️  SOZLAMA — ALOQA FORMASI

   Forma ma’lumotlari Google Sheets’ga tushishi uchun:
   1. apps-script.gs faylidagi kodni Google Sheets → Kengaytmalar →
      Apps Script ga joylashtiring
   2. Deploy → New deployment → Web app
      (Execute as: Me,  Who has access: Anyone)
   3. Chiqqan /exec havolasini quyidagi qatorga qo‘ying

   Bo‘sh qoldirilsa — forma baribir ishlaydi, lekin xabar Telegram
   orqali yuboriladi (matn avtomatik nusxalanadi).
   ═══════════════════════════════════════════════════════════════ */
var FORMA_MANZILI = 'https://script.google.com/macros/s/AKfycbwW_BIz1DQ4ncivknL0b6nf2Byhu3LIYG28Pc0YGiPlNJoa6q7G0TO_gFf_58MCncC71A/exec';

var TELEGRAM_NIK = 'bahodirlapasovapp';


/* ═══════════════════════════════════════════════════════════════
   📊  SOZLAMA — YANDEX METRIKA (tashrif statistikasi)

   1. metrika.yandex.ru → hisob yarating → «Sanoqchi qo‘shish»
   2. Sayt manzilini kiriting, «Webvisor» ni yoqing
   3. Berilgan sanoqchi raqamini (masalan 98765432) quyiga yozing

   Bo‘sh qoldirilsa — hech narsa yuklanmaydi, sayt bemalol ishlaydi.
   ═══════════════════════════════════════════════════════════════ */
var METRIKA_ID = '';


/* ═══════════════════════════════════════════════════════════════
   📈  SOZLAMA — GOOGLE ANALYTICS (Metrika o‘rniga ham bo‘ladi)

   1. analytics.google.com → Admin → «Create property»
   2. Sayt manzilini kiriting: zerocoder.netlify.app
   3. «Data streams» → Web → chiqqan MEASUREMENT ID ni quyiga yozing
      (u har doim G- bilan boshlanadi, masalan G-ABC1234XYZ)

   Bo‘sh qoldirilsa — hech narsa yuklanmaydi.
   Ikkalasini birga ishlatsa ham bo‘ladi.
   ═══════════════════════════════════════════════════════════════ */
var GA_ID = 'G-SSB57HM1FS';


/* ===================== MAVZU (dark / light) =====================
   Bu qism <head> da, sahifa chizilishidan oldin ishga tushadi —
   shuning uchun ochilishda rang "chaqnab" ketmaydi.
   Tanlov brauzer xotirasida (localStorage) saqlanadi.
   Hech narsa tanlanmagan bo‘lsa — qurilma sozlamasiga qarab ishlaydi. */

(function () {
  var ildiz = document.documentElement;

  function saqlanganMavzu() {
    try {
      return localStorage.getItem('mavzu');
    } catch (e) {
      return null; // maxfiy rejimda localStorage ishlamasligi mumkin
    }
  }

  function mavzuniSaqla(nom) {
    try {
      localStorage.setItem('mavzu', nom);
    } catch (e) {
      /* saqlab bo‘lmasa ham sayt ishlayveradi */
    }
  }

  // 1) Avvalgi tanlovni darhol qo‘llash
  var tanlangan = saqlanganMavzu();
  if (tanlangan === 'light' || tanlangan === 'dark') {
    ildiz.setAttribute('data-theme', tanlangan);
  }

  // 2) Hozir qaysi mavzu ko‘rinib turganini aniqlash
  function joriyMavzu() {
    var belgi = ildiz.getAttribute('data-theme');
    if (belgi) return belgi;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  // 3) Tugma bosilganda almashtirish
  document.addEventListener('DOMContentLoaded', function () {
    var tugma = document.getElementById('mavzu-tugma');
    if (!tugma) return;

    tugma.addEventListener('click', function () {
      var yangi = joriyMavzu() === 'dark' ? 'light' : 'dark';
      ildiz.setAttribute('data-theme', yangi);
      mavzuniSaqla(yangi);
    });
  });
})();


/* ===================== JONLANISH BAYROG‘I =====================
   Bu qism ham <head> da, sahifa chizilishidan oldin ishlaydi —
   shunda matn bir lahza ko‘rinib, keyin yashirinib qolmaydi.

   "animatsiya" sinfi faqat ikki shart bajarilsa qo‘yiladi. Sinf
   bo‘lmasa, style.css dagi yashirish qoidalari umuman ishlamaydi
   va sayt hech qanday animatsiyasiz, to‘liq ko‘rinadigan holda
   qoladi. Ya’ni jonlanish — ustiga qo‘shimcha, shart emas. */

(function () {
  var kamHarakat = false;
  try {
    kamHarakat = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {
    kamHarakat = false; // matchMedia yo‘q bo‘lsa — animatsiyasiz qolgani xavfsizroq
  }

  if ('IntersectionObserver' in window && !kamHarakat) {
    document.documentElement.classList.add('animatsiya');
  }
})();


/* ===================== QOLGAN MAYDA ISHLAR ===================== */
document.addEventListener('DOMContentLoaded', function () {

  // Pastki qismdagi yilni avtomatik yangilaydi
  var yil = document.getElementById('yil');
  if (yil) {
    yil.textContent = new Date().getFullYear();
  }

  /* Header balandligini aniq o‘lchab, CSS'ga uzatamiz.
     Shunda menyudan bo‘limga o‘tilganda bo‘lim tepasi header ostida
     qolib ketmaydi — istalgan ekran kengligida to‘g‘ri ishlaydi. */
  var navPanel = document.querySelector('.nav');
  var lentaPanel = document.querySelector('.lenta');

  if (navPanel) {
    var olchash = function () {
      var navBalandlik = Math.round(navPanel.getBoundingClientRect().height);
      if (navBalandlik > 0) {
        document.documentElement.style.setProperty('--nav-balandligi', navBalandlik + 'px');
      }
      // Lenta balandligi ham kerak: hero aynan shu ikkisidan qolgan
      // joyni egallaydi, natijada birinchi ekran lenta bilan tugaydi.
      if (lentaPanel) {
        var lentaBalandlik = Math.round(lentaPanel.getBoundingClientRect().height);
        if (lentaBalandlik > 0) {
          document.documentElement.style.setProperty('--lenta-balandligi', lentaBalandlik + 'px');
        }
      }
    };

    olchash();

    /* ResizeObserver navbar o‘lchami o‘zgargan HAR QANDAY holatda ishlaydi:
       oyna kengligi, ekran burilishi, menyu ikki qatorga tushishi, shrift
       yuklanishi. Oddiy 'resize' hodisasi bularning hammasini tutmaydi. */
    if (window.ResizeObserver) {
      var kuzatgich = new ResizeObserver(olchash);
      kuzatgich.observe(navPanel);
      if (lentaPanel) kuzatgich.observe(lentaPanel);
    } else {
      window.addEventListener('resize', olchash);
      window.addEventListener('orientationchange', olchash);
    }

    // Shrift yuklangach balandlik biroz o‘zgarishi mumkin
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(olchash);
    }
  }

  // Scroll paytida menyuda joriy bo‘lim belgilanadi.
  // O‘ngdagi "Bog‘lanish" tugmasi ham shu ro‘yxatga kiradi — aloqa
  // bo‘limiga yetganda u ham yoritiladi.
  var menyuHavolalari = Array.prototype.slice.call(
    document.querySelectorAll('.nav-links a[href^="#"], .nav-cta[href^="#"]')
  );

  if (menyuHavolalari.length && 'IntersectionObserver' in window) {
    var bolimlar = menyuHavolalari
      .map(function (a) { return document.querySelector(a.getAttribute('href')); })
      .filter(Boolean);

    function belgila(id) {
      menyuHavolalari.forEach(function (a) {
        var faol = a.getAttribute('href') === '#' + id;
        a.classList.toggle('faol', faol);
        if (faol) {
          a.setAttribute('aria-current', 'true');
        } else {
          a.removeAttribute('aria-current');
        }
      });
    }

    // Ekranda eng ko‘p ko‘rinib turgan bo‘limni tanlaymiz
    function yangila() {
      var eng = null;
      bolimlar.forEach(function (b) {
        var r = b.getBoundingClientRect();
        var korinish = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 90);
        if (korinish > 0 && (!eng || korinish > eng.korinish)) {
          eng = { id: b.id, korinish: korinish };
        }
      });
      if (eng) belgila(eng.id);
    }

    var kuzatuvchi = new IntersectionObserver(yangila, {
      rootMargin: '-90px 0px -40% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    });

    bolimlar.forEach(function (b) { kuzatuvchi.observe(b); });
    yangila();
  }

  /* ===================== ALOQA FORMASI ===================== */
  var forma = document.getElementById('aloqa-forma');

  if (forma) {
    var tugma = document.getElementById('forma-tugma');
    var tugmaMatn = tugma.querySelector('.tugma-matn');
    var holat = document.getElementById('forma-holat');

    // O‘zbekistonda ishlatiladigan operator va viloyat kodlari
    var UZ_KODLAR = [
      '20', '33', '50', '55', '77', '88', '90', '91', '93', '94', '95', '97', '98', '99',
      '61', '62', '65', '66', '67', '69', '70', '71', '72', '73', '74', '75', '76', '78', '79'
    ];

    var telInput = document.getElementById('f-tel');

    function telRaqamlari() {
      return telInput.value.replace(/\D/g, '').slice(0, 9);
    }

    function telTogrimi() {
      var r = telRaqamlari();
      return r.length === 9 && UZ_KODLAR.indexOf(r.slice(0, 2)) !== -1;
    }

    // Yozayotganda "90 123 45 67" ko‘rinishiga keltiramiz
    telInput.addEventListener('input', function () {
      var r = telRaqamlari();
      var b = [r.slice(0, 2), r.slice(2, 5), r.slice(5, 7), r.slice(7, 9)];
      telInput.value = b.filter(Boolean).join(' ');
    });

    var maydonlar = [
      { input: document.getElementById('f-ism'), xato: document.getElementById('xato-ism'),
        tekshir: function () { return document.getElementById('f-ism').value.trim().length >= 7; } },

      { input: telInput, xato: document.getElementById('xato-tel'),
        tekshir: telTogrimi },

      { input: document.getElementById('f-biznes'), xato: document.getElementById('xato-biznes'),
        tekshir: function () { return document.getElementById('f-biznes').value !== ''; } },

      { input: document.getElementById('f-xabar'), xato: document.getElementById('xato-xabar'),
        tekshir: function () { return document.getElementById('f-xabar').value.trim().length >= 10; } }
    ];

    function holatKorsat(matn, tur) {
      holat.textContent = matn;
      holat.className = 'holat' + (tur ? ' ' + tur : '');
    }

    function maydonTekshir(m) {
      var yaxshi = m.tekshir();
      m.xato.hidden = yaxshi;
      m.input.setAttribute('aria-invalid', yaxshi ? 'false' : 'true');
      return yaxshi;
    }

    // Xatoni foydalanuvchi tuzatishi bilan darhol yo‘qotamiz
    maydonlar.forEach(function (m) {
      var hodisa = m.input.tagName === 'SELECT' ? 'change' : 'input';
      m.input.addEventListener(hodisa, function () {
        if (m.input.getAttribute('aria-invalid') === 'true') maydonTekshir(m);
      });
    });

    function xabarMatni(d) {
      return 'Yangi murojaat\n\n'
        + 'Ism: ' + d.ism + '\n'
        + 'Telefon: ' + d.telefon + '\n'
        + (d.biznes ? 'Soha: ' + d.biznes + '\n' : '')
        + (d.xabar ? '\n' + d.xabar : '');
    }

    forma.addEventListener('submit', function (e) {
      e.preventDefault();

      // Spam tuzog‘i to‘ldirilgan bo‘lsa — bot, jimgina to‘xtatamiz
      if (forma.elements.sayt.value) return;

      var barchasiYaxshi = true;
      maydonlar.forEach(function (m) {
        if (!maydonTekshir(m)) barchasiYaxshi = false;
      });

      if (!barchasiYaxshi) {
        holatKorsat('Belgilangan maydonlarni to‘ldiring', 'xato-holat');
        maydonlar.some(function (m) {
          if (m.input.getAttribute('aria-invalid') === 'true') { m.input.focus(); return true; }
          return false;
        });
        return;
      }

      var malumot = {
        ism: forma.elements.ism.value.trim(),
        // Jadvalga to‘liq xalqaro ko‘rinishda tushadi: +998901234567
        telefon: '+998' + telRaqamlari(),
        biznes: forma.elements.biznes.value,
        xabar: forma.elements.xabar.value.trim(),
        sahifa: location.href,
        vaqt: new Date().toISOString()
      };

      tugma.disabled = true;
      tugmaMatn.textContent = 'Yuborilmoqda…';
      holatKorsat('');

      function tugadi(matn, tur) {
        tugma.disabled = false;
        tugmaMatn.textContent = 'Yuborish';
        holatKorsat(matn, tur);
      }

      // Apps Script manzili sozlanmagan bo‘lsa — Telegram orqali
      if (!FORMA_MANZILI) {
        var matn = xabarMatni(malumot);
        var nusxa = navigator.clipboard
          ? navigator.clipboard.writeText(matn).then(function () { return true; }, function () { return false; })
          : Promise.resolve(false);

        nusxa.then(function (nusxalandi) {
          window.open('https://t.me/' + TELEGRAM_NIK, '_blank', 'noopener');
          tugadi(
            nusxalandi
              ? 'Telegram ochildi — xabaringiz nusxalandi, qo‘yib yuboring.'
              : 'Telegram ochildi — xabaringizni shu yerga yozing.',
            'muvaffaqiyat'
          );
        });
        return;
      }

      var tana = new URLSearchParams(malumot);

      /* Apps Script javobi CORS'ga ruxsat bermaydi — javobni baribir
         o‘qiy olmaymiz. Shuning uchun uni KUTMAYMIZ: so‘rov fonda ketadi,
         foydalanuvchi esa natijani darhol ko‘radi.

         keepalive — foydalanuvchi sahifani yopib ketsa ham so‘rov oxirigacha boradi.

         ESLATMA: bu yerga redirect:'manual' qo‘shib bo‘lmaydi. Fetch
         spetsifikatsiyasi bo‘yicha mode:'no-cors' bilan redirect 'follow'
         dan boshqa bo‘lsa, so‘rov darhol TypeError bilan yiqiladi va
         ma’lumot umuman yuborilmaydi. */
      var sorov = fetch(FORMA_MANZILI, {
        method: 'POST',
        mode: 'no-cors',
        keepalive: true,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: tana.toString()
      });

      // Kutmasdan darhol muvaffaqiyat ko‘rsatamiz
      forma.reset();
      maydonlar.forEach(function (m) {
        m.xato.hidden = true;
        m.input.removeAttribute('aria-invalid');
      });
      tugadi('Rahmat! Xabaringiz yetib bordi — tez orada bog‘lanaman.', 'muvaffaqiyat');

      // Tarmoq xatosi bo‘lsa — yozganlarini qaytarib, ogohlantiramiz
      sorov.catch(function () {
        forma.elements.ism.value = malumot.ism;
        telInput.value = malumot.telefon.replace('+998', '');
        telInput.dispatchEvent(new Event('input'));
        forma.elements.biznes.value = malumot.biznes;
        forma.elements.xabar.value = malumot.xabar;
        tugadi('Yuborilmadi — internet aloqasini tekshiring yoki Telegram orqali yozing.', 'xato-holat');
      });
    });
  }

  /* ===================== TASHRIF STATISTIKASI =====================
     Yandex Metrika faqat sanoqchi raqami kiritilgan bo‘lsa yuklanadi.
     Skript sahifa chizilib bo‘lgandan keyin qo‘shiladi — ochilish
     tezligiga ta’sir qilmaydi. */
  // Google Analytics — faqat to‘g‘ri ko‘rinishdagi ID kiritilgan bo‘lsa
  if (typeof GA_ID === 'string' && /^G-[A-Z0-9]{6,}$/.test(GA_ID)) {
    var gaSkript = document.createElement('script');
    gaSkript.async = true;
    gaSkript.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(gaSkript);

    window.dataLayer = window.dataLayer || [];
    var gtag = function () { window.dataLayer.push(arguments); };
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  if (typeof METRIKA_ID === 'string' && /^\d{6,}$/.test(METRIKA_ID)) {
    (function (m, e, t, r, i, k, a) {
      m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
      m[i].l = 1 * new Date();
      k = e.createElement(t); a = e.getElementsByTagName(t)[0];
      k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

    ym(METRIKA_ID, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true
    });
  }

  // Rasm hali qo‘yilmagan bo‘lsa, joyida chiroyli "bo‘sh joy" ko‘rsatiladi.
  // Rasmlarni images/ papkasiga tashlaganingizda bu o‘z-o‘zidan yo‘qoladi.
  document.querySelectorAll('.rasm-joy img').forEach(function (img) {
    var joy = img.closest('.rasm-joy');

    function boshQil() {
      joy.classList.add('bosh');
    }

    if (img.complete) {
      if (!img.naturalWidth) boshQil();
    } else {
      img.addEventListener('error', boshQil);
      img.addEventListener('load', function () {
        joy.classList.remove('bosh');
      });
    }
  });

});


/* ===================== SKROLLDA PAYDO BO‘LISH =====================
   Bo‘lim sarlavhalari va kartalar ekranga kirganda yumshoq ko‘tarilib
   chiqadi. Har element bir marta — yuqoriga qaytganda qayta o‘ynamaydi.

   Bayroq qo‘yilmagan bo‘lsa (JS o‘chiq, eski brauzer, kam harakat
   rejimi) bu blok umuman ishga tushmaydi va matn oddiy ko‘rinadi. */

document.addEventListener('DOMContentLoaded', function () {
  var ildiz = document.documentElement;
  if (!ildiz.classList.contains('animatsiya')) return;

  var TANLOV = [
    '.bolim .bolim-yorliq',
    '.bolim h2',
    '.karta',
    '.qadam',
    '.sj-band'
  ].join(',');

  var elementlar = Array.prototype.slice.call(document.querySelectorAll(TANLOV));
  if (!elementlar.length) return;

  // Bir qatordagi kartalar ketma-ket chiqsin — ota element bo‘yicha
  // guruhlab, har biriga kichik kechikish beramiz. 5 tadan keyin
  // kechikish oshmaydi, aks holda oxirgi karta juda kech chiqadi.
  var hisob = {};
  elementlar.forEach(function (el) {
    var ota = el.parentNode;
    var kalit = ota ? (ota.className || 'yolgiz') : 'yolgiz';
    hisob[kalit] = (hisob[kalit] || 0) + 1;
    var tartib = Math.min(hisob[kalit] - 1, 5);
    if (tartib > 0) el.style.animationDelay = (tartib * 50) + 'ms';
  });

  function korsat(el) {
    el.classList.add('korindi');
  }

  var kuzatuvchi = new IntersectionObserver(function (yozuvlar, kuz) {
    yozuvlar.forEach(function (y) {
      if (!y.isIntersecting) return;
      korsat(y.target);
      kuz.unobserve(y.target);
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });

  elementlar.forEach(function (el) { kuzatuvchi.observe(el); });

  // Xavfsizlik to‘ri: kuzatuvchi negadir ishlamay qolsa, ekranda
  // turgan matn yashirin qolib ketmasin. Faqat ko‘rinadigan joydagi
  // elementlar ochiladi — pastdagilar o‘z navbatini kutaveradi.
  window.addEventListener('load', function () {
    setTimeout(function () {
      elementlar.forEach(function (el) {
        if (el.classList.contains('korindi')) return;
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          korsat(el);
          kuzatuvchi.unobserve(el);
        }
      });
    }, 1200);
  });
});
