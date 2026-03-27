import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRODUCTS_FILE = path.join(__dirname, "../src/data/products.ts");

const content = fs.readFileSync(PRODUCTS_FILE, "utf8");

const TR_EN = {
  yatak: "Bed", karyola: "Bed Frame", beşik: "Cradle", gardırop: "Wardrobe",
  şifonyer: "Dresser", komodin: "Nightstand", kitaplık: "Bookshelf",
  masa: "Table", sandalye: "Chair", raf: "Shelf", dolap: "Cabinet",
  sepet: "Basket", kutu: "Box", çocuk: "Children's", bebek: "Baby",
  ahşap: "Wooden", doğal: "Natural", montessori: "Montessori",
  arabalı: "Car-shaped", minibüs: "Minibus", dozer: "Bulldozer",
  traktör: "Tractor", polis: "Police", ambulans: "Ambulance",
  itfaiye: "Fire Truck", "çatılı": "Roofed", masif: "Solid Wood",
  rattan: "Rattan", hazeran: "Wicker", aktivite: "Activity",
  eğitim: "Educational", oyuncak: "Toy", salıncak: "Swing",
  kaydırak: "Slide", tırmanma: "Climbing", denge: "Balance",
  duvar: "Wall", panel: "Panel", piknik: "Picnic", ev: "House",
  kulübe: "Cabin", küçük: "Small", büyük: "Large", set: "Set",
  takım: "Set", "oyun": "Play", "alan": "Area", "mobilya": "Furniture",
  "düzenleyici": "Organizer", "depolama": "Storage", "ayna": "Mirror",
  "kapı": "Door", "pencere": "Window", "merdiven": "Ladder",
  "basamak": "Step", "platform": "Platform", "köprü": "Bridge",
  "tünel": "Tunnel", "kale": "Castle", "gemi": "Ship",
  "uçak": "Airplane", "helikopter: ": "Helicopter",
  "bisiklet": "Bicycle", "araba": "Car", "kamyon": "Truck",
  "kemerli": "Arched", "üçgen": "Triangle", "yuvarlak": "Round",
  "kare": "Square", "dikdörtgen": "Rectangle",
  "beyaz": "White", "siyah": "Black", "gri": "Gray", "mavi": "Blue",
  "pembe": "Pink", "yeşil": "Green", "kırmızı": "Red", "sarı": "Yellow",
  "ölçü": "Dimensions", "boyut": "Size", "genişlik": "Width",
  "yükseklik": "Height", "derinlik": "Depth", "uzunluk": "Length",
  "ağırlık": "Weight", "malzeme": "Material",
  "lake": "Lacquer", "boya": "Paint", "vernik": "Varnish",
  "iç yatak": "Mattress", "fiyata dahil değildir": "not included in the price",
  "fiyata dahildir": "included in the price",
  "ek ücret": "Additional charge", "istenirse": "Upon request",
  "özel sipariş": "Custom order", "sipariş üzerine": "Made to order",
  "stokta": "In stock", "hazır": "Ready",
  "uzay": "Space", "gökkuşağı": "Rainbow", "yapboz": "Puzzle",
  "blok": "Block", "istifleyici": "Stacker", "mutfak": "Kitchen",
};

const EN_TR = {
  bed: "yatak", "bed frame": "karyola", cradle: "beşik", wardrobe: "gardırop",
  dresser: "şifonyer", nightstand: "komodin", bookshelf: "kitaplık",
  table: "masa", desk: "çalışma masası", chair: "sandalye", shelf: "raf",
  cabinet: "dolap", wooden: "ahşap", natural: "doğal",
  "children's": "çocuk", kids: "çocuk", baby: "bebek", toddler: "küçük çocuk",
  toy: "oyuncak", swing: "salıncak", slide: "kaydırak",
  climbing: "tırmanma", balance: "denge", playhouse: "oyun evi",
  playground: "oyun alanı", indoor: "iç mekan", outdoor: "dış mekan",
  activity: "aktivite", storage: "depolama", organizer: "düzenleyici",
  puzzle: "yapboz", rainbow: "gökkuşağı", stacker: "istifleyici",
  block: "blok", kitchen: "mutfak", food: "yiyecek",
  mirror: "ayna", ladder: "merdiven", step: "basamak",
  platform: "platform", bridge: "köprü", tunnel: "tünel",
  castle: "kale", ship: "gemi", "fire truck": "itfaiye aracı",
  tractor: "traktör", car: "araba", truck: "kamyon",
  ramp: "rampa", triangle: "üçgen", arch: "kemer",
  board: "tahta", bench: "bank/oturak", cushion: "minder",
  mat: "mat/paspas", rug: "halı", curtain: "perde",
  furniture: "mobilya", set: "takım", collection: "koleksiyon",
  handcrafted: "el yapımı", "hand-crafted": "el yapımı",
  premium: "premium", quality: "kaliteli",
  plywood: "kontraplak", birch: "kayın ağacı", beech: "kayın ağacı",
  pine: "çam", oak: "meşe", walnut: "ceviz", cedar: "sedir",
  white: "beyaz", black: "siyah", gray: "gri", grey: "gri",
  blue: "mavi", pink: "pembe", green: "yeşil", red: "kırmızı",
  yellow: "sarı", orange: "turuncu", purple: "mor",
  large: "büyük", small: "küçük", medium: "orta", mini: "mini",
  height: "yükseklik", width: "genişlik", depth: "derinlik",
  length: "uzunluk", weight: "ağırlık", size: "boyut",
  gym: "jimnastik", rocker: "sallanan", rocking: "sallanan",
  "pull up bar": "barfiks", bar: "bar", ring: "halka",
  rope: "ip", net: "ağ", wall: "duvar", panel: "panel",
  classroom: "sınıf", school: "okul", preschool: "anaokulu",
  nursery: "kreş", daycare: "çocuk bakımevi",
  art: "sanat", science: "bilim", music: "müzik",
  square: "kare", rectangular: "dikdörtgen", round: "yuvarlak",
  adjustable: "ayarlanabilir", foldable: "katlanabilir",
  stackable: "istiflenebilir", modular: "modüler",
  educational: "eğitici", montessori: "montessori",
  accessory: "aksesuar", accessories: "aksesuarlar",
  "nesting dolls": "matruşka", doll: "oyuncak bebek",
  "play kitchen": "oyun mutfağı", "play food": "oyun yiyeceği",
  "building blocks": "yapı blokları", "ring stacker": "halka istifleyici",
};

function isTurkish(text) {
  return /[çÇğĞıİöÖşŞüÜ]/.test(text) ||
    /\b(yatak|karyola|gardırop|kitaplık|sandalye|çocuk|bebek|ahşap|montessori|arabalı|ölçü)\b/i.test(text);
}

function cmToInch(cm) {
  return Math.round(cm * 0.3937 * 4) / 4;
}

function inchToCm(inch) {
  return Math.round(inch * 2.54);
}

function formatInches(val) {
  const whole = Math.floor(val);
  const frac = val - whole;
  if (frac < 0.13) return `${whole}\u2033`;
  if (frac < 0.38) return `${whole}\u00BC\u2033`;
  if (frac < 0.63) return `${whole}\u00BD\u2033`;
  if (frac < 0.88) return `${whole}\u00BE\u2033`;
  return `${whole + 1}\u2033`;
}

function addDualMeasurements(text) {
  let result = text;
  result = result.replace(/(\d+(?:[.,]\d+)?)\s*cm\b(?!\s*[\/\(]\s*\d)/gi, (match, num) => {
    const cm = parseFloat(num.replace(",", "."));
    const inches = cmToInch(cm);
    return `${num} cm (${formatInches(inches)})`;
  });
  result = result.replace(/(\d+(?:[.,]\d+)?)\s*mm\b(?!\s*[\/\(]\s*\d)/gi, (match, num) => {
    const mm = parseFloat(num.replace(",", "."));
    const cm = mm / 10;
    const inches = cmToInch(cm);
    return `${num} mm (${cm} cm / ${formatInches(inches)})`;
  });
  result = result.replace(/(\d+)\s*[×x]\s*(\d+)\s*cm/gi, (match, w, h) => {
    const wCm = parseInt(w), hCm = parseInt(h);
    const wIn = cmToInch(wCm), hIn = cmToInch(hCm);
    return `${w}×${h} cm (${formatInches(wIn)} × ${formatInches(hIn)})`;
  });
  result = result.replace(/(\d+)\s*[×x]\s*(\d+)\s*[×x]\s*(\d+)\s*cm/gi, (match, a, b, c) => {
    const aCm = parseInt(a), bCm = parseInt(b), cCm = parseInt(c);
    return `${a}×${b}×${c} cm (${formatInches(cmToInch(aCm))} × ${formatInches(cmToInch(bCm))} × ${formatInches(cmToInch(cCm))})`;
  });
  return result;
}

function translateTrToEn(text) {
  if (!text) return text;
  let result = text;
  const sortedKeys = Object.keys(TR_EN).sort((a, b) => b.length - a.length);
  for (const tr of sortedKeys) {
    const regex = new RegExp(`\\b${tr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    result = result.replace(regex, (m) => {
      const en = TR_EN[tr.toLowerCase()];
      return m[0] === m[0].toUpperCase() ? en.charAt(0).toUpperCase() + en.slice(1) : en;
    });
  }
  result = result
    .replace(/İç\s+yatak/gi, "Mattress")
    .replace(/fiyata\s+dahil\s+değildir/gi, "not included in the price")
    .replace(/fiyata\s+dahildir/gi, "included in the price")
    .replace(/ek\s+ücret\s+ile/gi, "for an additional charge")
    .replace(/istenirse/gi, "upon request")
    .replace(/başlangıç\s+ölçüsü/gi, "starting dimensions")
    .replace(/\bGörselde\b/gi, "As shown in the image")
    .replace(/\bgözüken\b/gi, "shown")
    .replace(/\bşekilde\b/gi, "as shown")
    .replace(/\btek\s+taraflı\b/gi, "single-sided")
    .replace(/\bdetaylar\b/gi, "details")
    .replace(/\bmodele\s+dahildir\b/gi, "are included in the model")
    .replace(/\bteker\b/gi, "wheel")
    .replace(/\barka\s+taraftaki\b/gi, "rear")
    .replace(/\beklenebilir\b/gi, "can be added")
    .replace(/\büzerinde\b/gi, "on")
    .replace(/\büzeri\b/gi, "over")
    .replace(/\bkullanılmaktadır\b/gi, "is used")
    .replace(/\bkurunsuz\b/gi, "lead-free")
    .replace(/\bÖLÇÜLERİNDE\b/gi, "in dimensions of")
    .replace(/\bDERİNLİĞİNDEDİR\b/gi, "depth");
  return result;
}

function translateEnToTr(text) {
  if (!text) return text;
  let result = text;
  const sortedKeys = Object.keys(EN_TR).sort((a, b) => b.length - a.length);
  for (const en of sortedKeys) {
    const regex = new RegExp(`\\b${en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    result = result.replace(regex, (m) => {
      const tr = EN_TR[en.toLowerCase()];
      return m[0] === m[0].toUpperCase() ? tr.charAt(0).toUpperCase() + tr.slice(1) : tr;
    });
  }
  result = result
    .replace(/\bWhat's in This Set\b/gi, "Bu Sette Neler Var")
    .replace(/\bhandcrafted by\b/gi, "tarafından el yapımı üretilmiştir,")
    .replace(/\bfrom premium\b/gi, "premium kalite")
    .replace(/\bNon-toxic\b/gi, "Toksik olmayan")
    .replace(/\bwater-based paint\b/gi, "su bazlı boya")
    .replace(/\bquality\b/gi, "kaliteli")
    .replace(/\bby\b/gi, "tarafından")
    .replace(/\bUkrainian artisans\b/gi, "Ukraynalı zanaatkarlar")
    .replace(/\blinden and birch wood\b/gi, "ıhlamur ve kayın ağacı")
    .replace(/\bMade from\b/gi, "Yapıldığı malzeme:")
    .replace(/\bMade of\b/gi, "Yapıldığı malzeme:")
    .replace(/\bAvailable in\b/gi, "Mevcut seçenekler:")
    .replace(/\bSuitable for\b/gi, "Uygun yaş:")
    .replace(/\bAges\b/gi, "Yaş grubu")
    .replace(/\bWeight capacity\b/gi, "Ağırlık kapasitesi")
    .replace(/\bAssembly required\b/gi, "Montaj gereklidir")
    .replace(/\bNo assembly required\b/gi, "Montaj gerektirmez")
    .replace(/\bShips flat\b/gi, "Düz gönderilir")
    .replace(/\bFree shipping\b/gi, "Ücretsiz kargo");
  return result;
}

function processProducts() {
  let output = content;

  const productBlockRegex = /(\{\s*\n\s*id:\s*"[^"]+",\s*\n\s*name:\s*")([^"]*?)(",\s*\n)/g;

  let count = 0;
  let trCount = 0;
  let enCount = 0;

  const nameBlocks = [];
  let nm;
  while ((nm = productBlockRegex.exec(content)) !== null) {
    nameBlocks.push({ index: nm.index, full: nm[0], name: nm[2], before: nm[1], after: nm[3] });
  }

  console.log(`Found ${nameBlocks.length} product name blocks`);

  const descRegex = /(\s*description:\s*\n?\s*")([^]*?)(",?\s*\n)/g;
  const descBlocks = [];
  let dm;
  while ((dm = descRegex.exec(content)) !== null) {
    if (dm.index > 2000) {
      descBlocks.push({ index: dm.index, full: dm[0], desc: dm[2], before: dm[1], after: dm[3] });
    }
  }

  console.log(`Found ${descBlocks.length} description blocks`);

  let insertions = [];

  for (let i = 0; i < nameBlocks.length; i++) {
    const nb = nameBlocks[i];
    const name = nb.name;
    const isTR = isTurkish(name);
    
    let name_tr, name_en;
    if (isTR) {
      name_tr = name;
      name_en = translateTrToEn(name);
      trCount++;
    } else {
      name_en = name;
      name_tr = translateEnToTr(name);
      enCount++;
    }

    const endOfName = nb.index + nb.full.length;
    insertions.push({
      pos: endOfName,
      text: ` name_tr: "${name_tr.replace(/"/g, '\\"')}",\n name_en: "${name_en.replace(/"/g, '\\"')}",\n`,
    });
    count++;
  }

  for (let i = 0; i < descBlocks.length; i++) {
    const db = descBlocks[i];
    let desc = db.desc;
    const isTR = isTurkish(desc);

    desc = addDualMeasurements(desc);

    let desc_tr, desc_en;
    if (isTR) {
      desc_tr = desc;
      desc_en = translateTrToEn(desc);
    } else {
      desc_en = desc;
      desc_tr = translateEnToTr(desc);
    }

    const endOfDesc = db.index + db.full.length;
    insertions.push({
      pos: endOfDesc,
      text: ` description_tr: "${desc_tr.replace(/"/g, '\\"')}",\n description_en: "${desc_en.replace(/"/g, '\\"')}",\n`,
    });
  }

  insertions.sort((a, b) => b.pos - a.pos);

  for (const ins of insertions) {
    output = output.substring(0, ins.pos) + ins.text + output.substring(ins.pos);
  }

  const interfaceUpdate = output.replace(
    /export interface Product \{[^}]*\}/,
    `export interface Product {
 id: string;
 name: string;
 name_tr: string;
 name_en: string;
 price: number;
 formattedPrice: string;
 category: string;
 urlPart: string;
 images: string[];
 description: string;
 description_tr: string;
 description_en: string;
 tags?: string[];
 sku: string;
 sourceUrl: string;
 etsyUrl?: string;
}`
  );

  fs.writeFileSync(PRODUCTS_FILE, interfaceUpdate, "utf8");

  console.log(`\nProcessed ${count} products`);
  console.log(`Turkish names: ${trCount}, English names: ${enCount}`);
  console.log(`Description blocks: ${descBlocks.length}`);
  console.log("File updated successfully.");
}

processProducts();
