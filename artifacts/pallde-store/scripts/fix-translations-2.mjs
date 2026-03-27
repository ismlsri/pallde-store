import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRODUCTS_FILE = path.join(__dirname, "../src/data/products.ts");

let content = fs.readFileSync(PRODUCTS_FILE, "utf8");

const FIXES = [
  [/Seriessi/gi, "Series"],
  [/SeriesES/gi, "Series"],
  [/GARDIROP/gi, "Wardrobe"],
  [/Gardırop/gi, "Wardrobe"],
  [/gardırop/g, "wardrobe"],
  [/KAPAKLI/gi, "Door"],
  [/Kapaklı/gi, "Door"],
  [/EKLENTİLİ/g, "With Extension"],
  [/Eklentili/g, "With Extension"],
  [/ÇEKMECELİ/g, "With Drawers"],
  [/DRESSERLİ/g, "With Dresser"],
  [/SEPETLİ/g, "With Basket"],
  [/IŞIKLI/g, "Illuminated"],
  [/İŞIKLI/g, "Illuminated"],
  [/Işıklı/g, "Illuminated"],
  [/IŞIKSIZ/g, "Without Light"],
  [/IŞIĞI/g, "Light"],
  [/GÖKKUŞAĞİ/g, "Rainbow"],
  [/GÖKKUŞAĞI/g, "Rainbow"],
  [/OLİVER/g, "Oliver"],
  [/SOFİA/g, "Sofia"],
  [/LİNA/g, "Lina"],
  [/LİNEA/g, "Linea"],
  [/ŞİFONYERLİ/g, "With Dresser"],
  [/HOUSEİM/g, "House"],
  [/AREAı/g, "Area"],
  [/LUNA/g, "Luna"],
  [/4'lü/g, "4-Piece"],
  [/3'lü/g, "3-Piece"],
  [/2'li/g, "2-Piece"],
  [/Zarif/gi, "Elegant"],
  [/Motifli/gi, "Patterned"],
  [/Tavşan/gi, "Rabbit"],
  [/Kulplu/gi, "Handled"],
  [/Kutulu/gi, "Boxed"],
  [/Etkinlik/gi, "Activity"],
  [/İsveç Ladinli/gi, "Swedish Spruce"],
  [/Yıldız/gi, "Star"],
  [/Bulut/gi, "Cloud"],
  [/Detaylı/gi, "Detailed"],
  [/Şık/gi, "Stylish"],
  [/Cam/gi, "Glass"],
  [/Çatı/gi, "Roof"],
  [/Niş/gi, "Niche"],
  [/Açık/gi, "Open"],
  [/Kullanışlı/gi, "Practical"],
  [/Koç/gi, "Ram"],
  [/Sandalyesi/gi, "Chair"],
  [/Masalı/gi, "With Table"],
  [/ÇOK/gi, "Multi"],
  [/ARAÇLI/gi, "Vehicle"],
  [/Araçlı/gi, "Vehicle"],
  [/BÜYÜYEBİLEN/gi, "Expandable"],
  [/Büyüyebilen/gi, "Expandable"],
  [/CEVİZ/g, "Walnut"],
  [/İNCE/gi, "Slim"],
  [/ARALIK/gi, "Spacing"],
  [/İKİ/gi, "Two"],
  [/ÜÇ/gi, "Three"],
  [/DÖRT/gi, "Four"],
  [/BEŞ/gi, "Five"],
  [/ALTI/gi, "Six"],
  [/TEK/gi, "Single"],
  [/LED/g, "LED"],
  [/ASİL/g, "Noble"],
  [/AYDINLATMALI/g, "Illuminated"],
  [/Aydınlatmalı/g, "Illuminated"],
  [/RAFLI/g, "With Shelves"],
  [/Raflı/g, "With Shelves"],
  [/RENKLI/g, "Colorful"],
  [/Renkli/g, "Colorful"],
  [/TEMALI/g, "Themed"],
  [/Temalı/g, "Themed"],
  [/İÇ/g, "Inner"],
  [/DİRSEK/g, "Elbow"],
  [/İLERİ/g, "Forward"],
  [/YENİ/g, "New"],
  [/NESİL/g, "Generation"],
  [/TASARİM/g, "Design"],
  [/Tasarım/g, "Design"],
  [/ÇOCUK/g, "Children's"],
  [/– Wardrobe$/g, "Wardrobe"],
  [/\| /g, "- "],
];

const DESC_FIXES = [
  ...FIXES,
  [/kayın ağacından/gi, "beech wood"],
  [/üretilmiştir/gi, "is manufactured"],
  [/kullanılmıştır/gi, "is used"],
  [/eklenebilir/gi, "can be added"],
  [/iç yatak ölçüleri/gi, "mattress dimensions"],
  [/fiyata dahil değildir/gi, "not included in price"],
  [/fiyata dahildir/gi, "included in price"],
  [/ek ücret/gi, "additional charge"],
  [/masif ahşap/gi, "solid wood"],
  [/kurunsuz boya/gi, "lead-free paint"],
  [/su bazlı/gi, "water-based"],
  [/toksik olmayan/gi, "non-toxic"],
  [/sağlığına zararlı/gi, "harmful to health"],
  [/zararlı kimyasal/gi, "harmful chemical"],
  [/kimyasal madde/gi, "chemical substance"],
  [/ürünlerimizde/gi, "in our products"],
  [/kullanılmamaktadır/gi, "is not used"],
  [/düzenli kullanım/gi, "regular use"],
  [/alanları/gi, "areas"],
  [/ölçülerinde/gi, "in dimensions of"],
  [/ölçüleri:/gi, "dimensions:"],
  [/ölçüler:/gi, "dimensions:"],
  [/yüzey:/gi, "surface:"],
  [/ağacından/gi, "wood"],
  [/ağacı/gi, "wood"],
  [/üretilmiş/gi, "produced"],
  [/geniş/gi, "wide"],
  [/özel/gi, "special"],
  [/sağlığa/gi, "to health"],
  [/sağlığına/gi, "to health"],
  [/hiçbir/gi, "no"],
  [/içeren/gi, "containing"],
  [/üzeri/gi, "over"],
  [/üretim/gi, "production"],
  [/kullanım/gi, "use"],
  [/ürün/gi, "product"],
  [/ölçü/gi, "measurement"],
  [/için/gi, "for"],
  [/iç/g, "inner"],
  [/dışı/gi, "exterior"],
  [/üst/gi, "top"],
  [/alt/gi, "bottom"],
];

function applyFixes(text, fixes) {
  let result = text;
  for (const [regex, replacement] of fixes) {
    result = result.replace(regex, replacement);
  }
  return result;
}

let fixedEnNames = 0;
let fixedEnDescs = 0;

content = content.replace(/name_en: "([^"]*)"/g, (match, val) => {
  if (/[çÇğĞıİöÖşŞüÜ]/.test(val)) {
    const fixed = applyFixes(val, FIXES);
    fixedEnNames++;
    return `name_en: "${fixed}"`;
  }
  return match;
});

content = content.replace(/description_en: "([^"]*)"/g, (match, val) => {
  if (/[çÇğĞıİöÖşŞüÜ]/.test(val)) {
    const fixed = applyFixes(val, DESC_FIXES);
    fixedEnDescs++;
    return `description_en: "${fixed}"`;
  }
  return match;
});

fs.writeFileSync(PRODUCTS_FILE, content, "utf8");

console.log(`Fixed EN names pass 2: ${fixedEnNames}`);
console.log(`Fixed EN descriptions pass 2: ${fixedEnDescs}`);

const recheck = fs.readFileSync(PRODUCTS_FILE, "utf8");
const regex2 = /name_en:\s*"([^"]*)"/g;
let m2, remaining = 0;
while ((m2 = regex2.exec(recheck)) !== null) {
  if (/[çÇğĞıİöÖşŞüÜ]/.test(m2[1])) {
    remaining++;
    if (remaining <= 5) console.log('  Still has TR:', m2[1]);
  }
}
console.log(`Remaining EN names with Turkish: ${remaining}`);
