# Loyiha qoidalari

## Loyiha nima
Bahodir Lapasovning shaxsiy vizitka sayti — NoCode avtomatizatsiya mutaxassisi.
Auditoriya: O‘zbekistondagi biznes egalari. Maqsad — murojaat olish.
Sayt: https://zerocoder.netlify.app · Til: **faqat o‘zbekcha** (ruscha versiya yo‘q).

## Fayl tuzilishi
Saytga chiqadigan: `index.html` · `style.css` · `script.js` · `favicon.svg` ·
`apple-touch-icon.png` · `robots.txt` · `sitemap.xml` · `images/`

Repoda turadi, saytga chiqmaydi: `apps-script.gs`, `versiya.sh`,
`RASMLAR-HAQIDA.txt`, `CLAUDE.md`, `netlify.toml`, `_config.yml`.

Chiqmaslikni ikki fayl ta’minlaydi — Netlify uchun `netlify.toml` (faqat
kerakli fayllar `dist/` ga ko‘chiriladi), GitHub Pages uchun `_config.yml`
(`exclude` ro‘yxati). **Yangi fayl qo‘shsang, ikkalasini ham yangila.**

## Joylashtirish
Kod GitHub’da: `bakhodirlapasov-dot/mysite`. Bitta `git push` uch joyni
yangilaydi — repo, Netlify (asosiy sayt), GitHub Pages (nusxa).
`canonical`, `og:url`, `og:image` Netlify manzilini ko‘rsatadi — asosiysi u.

Havola kartasi rasmi (`images/og-v2.jpg`) o‘zgarsa — **faylga yangi nom ber**.
Telegram va Facebook rasmni manzili bo‘yicha keshlaydi, eski nom qolsa yangi
rasm ko‘rinmaydi. Keyin Telegramda @WebpageBot ga sayt havolasini yuborib
kesh tozalanadi; eski xabardagi karta baribir o‘zgarmaydi.

## Texnik chegaralar
- **Freymvork, build, npm yo‘q.** Sof HTML + CSS + JS. Tashqi kutubxona qo‘shilmaydi.
- Yagona tashqi manba — Google Fonts (Poppins). Boshqasi qo‘shilmasin.
- Rasmlar **WebP**, har birida `width`/`height`, pastdagilarga `loading="lazy"`.
- Ochiq sozlamalar `script.js` boshida (forma manzili, analitika ID) — ular
  brauzerga baribir ketadi, ochiq bo‘lishi normal.
- **Maxfiy kalit repoda umuman saqlanmaydi.** Telegram bot tokeni va chat ID
  faqat Google Apps Script muharririda turadi; repodagi `apps-script.gs` da
  ular doim bo‘sh satr — izohdagi misollar ham haqiqiy token bo‘lmasin.
- CSS/JS o‘zgarsa — `./versiya.sh` ishga tushiriladi (kesh uchun `?v=` oshadi).

## Uslub
- Barcha ranglar CSS o‘zgaruvchilari orqali — `style.css` boshidagi ikki blok (to‘q va yorug‘ mavzu). Qattiq rang yozilmaydi.
- Header, footer, mijozlar lentasi — bitta `--panel-bg` rangida.
- Matn kontrasti kamida **4.5:1**, grafik elementlar **3:1**.
- Sensorli qurilmada bosish maydonlari kamida **44×44px**.
- Ohang: sodda, aniq, biznesga tushunarli. Marketing safsatasi yo‘q, va’dalar bo‘rttirilmaydi.
- Oddiylik ustuvor: yangi bo‘lim yoki effekt faqat aniq foyda bersagina qo‘shiladi.

## Ish tartibi
- **Qurishdan oldin rejani ayt.** Nima o‘zgaradi, qayerda — keyin boshla.
- Kichik qadamlar bilan yur, har qadamdan keyin tekshir (o‘lchov yoki render).
- O‘zgarishdan keyin: HTML tuzilishi, konsol xatolari, 320–1920px oralig‘ida overflow.
- **Fakt to‘qima.** Mijoz fikri, natija raqami, tajriba — faqat Bahodir tasdiqlagani yoziladi.
  Ma’lumot yo‘q bo‘lsa — shablon qoldirib, undan so‘ra.
- Xato qilsang — yashirma, ayt va tuzat.

## Takrorlangan xatolar — shu qoidalarga amal qil

Quyidagilar shu loyihada allaqachon yuz bergan. Har biri qoida qilib yozilgan.

**1. Asbobni ayblashdan oldin asbobni tekshir.**
Skrinshot yoki o‘lchov g‘alati natija bersa, saytni tuzatishga kirishma —
avval o‘sha asbob umuman ishlayotganini isbotla. Nazorat namunasi ol:
o‘zgartirilmagan qismni yoki oldingi versiyani xuddi shu usulda o‘lchab ko‘r.
Bu loyihada shu tuzoqlarga tushilgan:
- Brauzer paneli yashirin bo‘lsa sahifa **chizilmaydi** —
  `IntersectionObserver` ishlamaydi, skrinshot eski kadrda qotadi.
  `document.hidden` bilan tekshir.
- Headless Chrome kichik `--window-size` da mobil viewport’ni qo‘llamaydi —
  yo‘q siljishni bordek ko‘rsatadi. Mobil o‘lchov uchun `iframe` ishlat.
- Headless Chrome manzilida `#havola` bo‘lsa bo‘sh rasm qaytaradi.
- `sips -c` rasmni **markazdan** kesadi, tepadan emas.
- Rangni mavzu almashgandan keyin darrov o‘lchama — 180ms o‘tish tugaguncha
  kutmasang, kontrast butunlay noto‘g‘ri chiqadi.

**2. Push oldidan barcha faylni sirga tekshir, faqat taxmin qilganini emas.**
Bir marta `script.js` tekshirilib, `apps-script.gs` tashlab ketilgan —
ochiq repoga haqiqiy Telegram tokeni tushgan. Har doim:
```
git ls-files -z | xargs -0 grep -nE '[0-9]{8,10}:[A-Za-z0-9_-]{30,}'
```
Kalit topilsa: avval uni bekor qilish (`/revoke`), keyin kodni tozalash.
Tarixni qayta yozish yetarli emas — eski commit SHA orqali ochiladi.

**3. 320–1920px ni zich qadam bilan tekshir, siyrak emas.**
Menyu 880–1320px oralig‘ida zo‘rg‘a sig‘adi. Bir marta 768 dan keyin darrov
1440 sinalgan va o‘sha oraliqdagi gorizontal siljish sezilmay qolgan.
Menyuga havola qo‘shilsa yoki matn uzaysa, shu nuqtalarni majburiy o‘lch:
**880, 900, 960, 1024, 1240, 1320**. Ishonchli usul — sahifani `iframe` da
ochib `documentElement.scrollWidth > kenglik` ni tekshirish.

**4. Lotin matniga kirill harfi tushmasin.**
`к о а е р с х` kabi harflar lotin ko‘rinishida bir xil, lekin boshqa belgi.
Bir marta saytga, bir marta xotiraga tushgan. Commitdan oldin tekshir:
```
grep -nP '[\x{0400}-\x{04FF}]' index.html style.css script.js
```

**5. Bor narsani qayta qurma.** Yangi bo‘lim so‘ralsa, avval mavjudligini
tekshir. Shu loyihada so‘ralgan ishlarning yarmi allaqachon qilingan bo‘lib
chiqqan — menyu, silliq skroll, kartalar, favicon, og-rasm.
