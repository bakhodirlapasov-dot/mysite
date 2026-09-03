#!/bin/bash
# ─────────────────────────────────────────────────────────────
#  Kesh yangilash — style.css va script.js versiyasini oshiradi
#
#  Ishlatish:  ./versiya.sh
#
#  CSS yoki JS faylini o‘zgartirgandan keyin shuni bir marta
#  ishga tushiring. Brauzer yangi faylni majburan yuklab oladi.
# ─────────────────────────────────────────────────────────────

set -e
cd "$(dirname "$0")"

HTML="index.html"

if [ ! -f "$HTML" ]; then
  echo "Xato: $HTML topilmadi"
  exit 1
fi

# Hozirgi versiyani o‘qiymiz
JORIY=$(grep -oE 'style\.css\?v=[0-9]+' "$HTML" | head -1 | grep -oE '[0-9]+$')

if [ -z "$JORIY" ]; then
  echo "Xato: index.html da ?v= belgisi topilmadi"
  exit 1
fi

YANGI=$((JORIY + 1))

# macOS va Linux sed uchun mos ishlaydi
perl -pi -e "s/style\.css\?v=$JORIY/style.css?v=$YANGI/g; s/script\.js\?v=$JORIY/script.js?v=$YANGI/g" "$HTML"

echo "Versiya yangilandi:  v$JORIY  →  v$YANGI"
grep -nE 'style\.css\?v=|script\.js\?v=' "$HTML" | sed 's/^/  /'
