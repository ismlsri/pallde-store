export interface Manufacturer {
  id: string;
  name: string;
  website: string;
  country: string;
  address?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  taxId?: string;
  owner?: string;
  ownerContact?: string;
  founded?: string;
  instagram?: string;
  facebook?: string;
  pinterest?: string;
  youtube?: string;
  etsy?: string;
  linkedin?: string;
  notes?: string;
  description?: { tr: string; en: string };
}

export const manufacturers: Record<string, Manufacturer> = {
  pallde: {
    id: "pallde",
    name: "Pallde Kids",
    website: "https://pallde.com",
    country: "Türkiye",
    address: "Mevlana Mah., Ataşehir, İstanbul, Türkiye",
    phone: "+90 533 949 25 90",
    whatsapp: "+90 533 949 25 90",
    email: "info@pallde.com",
    instagram: "https://www.instagram.com/palldekids",
    notes: "İstanbul merkezli ahşap çocuk mobilyaları üretimi. Arabalı yatak, Montessori karyola, ranza ve özel tasarım ürünler.",
    description: {
      tr: "Pallde Kids, İstanbul Ataşehir merkezli çocuk mobilyası markasıdır. Ahşap arabalı yataklar, Montessori karyolalar, ranzalar ve özel tasarım çocuk mobilyaları üretmektedir.",
      en: "Pallde Kids is an Istanbul-based children's furniture brand specializing in wooden car beds, Montessori cribs, bunk beds, and custom children's furniture designs.",
    },
  },

  tlc: {
    id: "tlc",
    name: "The Little Concept",
    website: "https://thelittleconcept.com",
    country: "Türkiye",
    address: "Güzelbahçe, İzmir, Türkiye",
    email: "info@thelittleconcept.com",
    instagram: "https://www.instagram.com/thelittleconcept",
    facebook: "https://www.facebook.com/thelittleconcept",
    notes: "İzmir merkezli premium çocuk odası mobilyaları. Karyola, gardırop, şifonyer, komodin, kitaplık ve aksesuar ürünleri.",
    description: {
      tr: "The Little Concept, İzmir'de üretilen yüksek kaliteli ahşap çocuk odası mobilyaları markasıdır. Karyola, gardırop, şifonyer, komodin, kitaplık ve masa-sandalye takımları üretmektedir.",
      en: "The Little Concept is a premium Turkish children's room furniture brand based in Izmir. They produce cribs, wardrobes, dressers, nightstands, bookshelves, and desk-chair sets.",
    },
  },

  bonchicbaby: {
    id: "bonchicbaby",
    name: "Bon Chic Baby",
    website: "https://bonchicbaby.com.tr",
    country: "Türkiye",
    address: "Beytepe Mah., 5387 Cad. No: 27/E İç Kapı No: 4, Çankaya, Ankara, Türkiye",
    phone: "+90 533 669 24 09",
    whatsapp: "+90 533 669 24 09",
    email: "info@bonchicbaby.com.tr",
    taxId: "5620845593",
    owner: "Kığmancıoğulları Tekstil Mobilya İnşaat San. ve Tic. Ltd. Şti.",
    instagram: "https://www.instagram.com/bonchicbaby.com.tr",
    facebook: "https://www.facebook.com/bonchicbaby",
    linkedin: "https://www.linkedin.com/company/bonchicbaby",
    notes: "Ticari unvan: Kığmancıoğulları Tekstil Mobilya İnşaat Sanayi ve Ticaret Limited Şirketi. MERSIS No: 0562084559300001. KEP: [email protected]. Bebek/çocuk mobilyası, tekstil, aydınlatma ve dekorasyon ürünleri.",
    description: {
      tr: "Bon Chic Baby, Ankara Beytepe'de faaliyet gösteren Kığmancıoğulları şirketine ait bebek ve çocuk mobilyası markasıdır. Karyola, gardırop, şifonyer, sedir, Montessori yatak, oyuncak dolabı, kitaplık ile birlikte giyim, tekstil, aydınlatma ve dekorasyon ürünleri sunmaktadır.",
      en: "Bon Chic Baby, owned by Kığmancıoğulları Ltd., is a baby and children's furniture brand based in Beytepe, Ankara. They offer cribs, wardrobes, dressers, daybeds, Montessori beds, toy cabinets, bookshelves, along with clothing, textiles, lighting, and decor products.",
    },
  },

  cedarworks: {
    id: "cedarworks",
    name: "CedarWorks",
    website: "https://cedarworks.com",
    country: "ABD (USA)",
    address: "799 Commercial Street, PO Box 990, Rockport, ME 04856, USA",
    phone: "+1 800-462-3327",
    email: "info@cedarworks.com",
    owner: "Barrett Brown (Owner & President)",
    founded: "1981",
    instagram: "https://www.instagram.com/cedarworks",
    facebook: "https://www.facebook.com/CedarWorks",
    pinterest: "https://www.pinterest.com/cedarworks",
    youtube: "https://www.youtube.com/user/CedarWorksPlaysets",
    notes: "ABD Rockport, Maine merkezli. Sedir ağacından üretilen bahçe oyun yapıları ve oyun aletleri. Barrett Brown 2000 yılından bu yana şirketin başında. Rockland, Maine'de üretim tesisi. ASTM ve CPSC güvenlik standartlarına uygun.",
    description: {
      tr: "CedarWorks, 1981'den bu yana ABD'nin Maine eyaleti Rockport'ta sedir ağacından premium bahçe oyun yapıları ve oyun aletleri üretmektedir. Barrett Brown yönetiminde, Rockland'daki fabrikada imal edilen ürünler ASTM ve CPSC güvenlik standartlarına uygundur.",
      en: "CedarWorks has been crafting premium cedar wood outdoor playsets and play structures in Rockport, Maine, USA since 1981. Under Barrett Brown's leadership, products are manufactured at their Rockland facility and meet ASTM and CPSC safety standards.",
    },
  },

  woodandhearts: {
    id: "woodandhearts",
    name: "Wood and Hearts",
    website: "https://woodandhearts.com",
    country: "Ukrayna (Ukraine)",
    address: "Ukrayna (ABD, Kanada, Almanya, Polonya, İngiltere, Japonya'da depolar)",
    phone: "+1 804-500-1025",
    email: "support@woodandhearts.com",
    owner: "Denys Shkribliak (Kurucu) & Roman Kondratiuk (CEO)",
    ownerContact: "Anna Kondratiuk (İletişim Direktörü) — wholesale.manager@woodandhearts.com (toptan), b2b.head@woodandhearts.com (B2B)",
    instagram: "https://www.instagram.com/woodandhearts",
    facebook: "https://www.facebook.com/woodandhearts",
    pinterest: "https://www.pinterest.com/woodandhearts",
    notes: "Ukrayna merkezli, dünya genelinde 6+ ülkede depolu Montessori ahşap tırmanma oyuncakları ve çocuk mobilyası üreticisi. FSC sertifikalı huş kontraplak ve kayın ağacından üretim. CE ve CPC sertifikalı. 2022'de Kyiv'deki üretim tesisleri yıkıldıktan sonra operasyonlarını yeniden kurdu.",
    description: {
      tr: "Wood and Hearts, Ukrayna merkezli Montessori ahşap tırmanma oyuncakları ve çocuk mobilyası üreticisidir. Denys Shkribliak tarafından kurulmuş, Roman Kondratiuk CEO olarak yönetmektedir. FSC sertifikalı huş kontraplak ve kayın ağacından üretim yapar. ABD, Kanada, Almanya, Polonya, İngiltere ve Japonya'da depoları bulunmaktadır.",
      en: "Wood and Hearts is a Ukrainian manufacturer of Montessori wooden climbing toys and children's furniture. Founded by Denys Shkribliak and led by CEO Roman Kondratiuk. Products are made from FSC-certified birch plywood and beech wood, with CE and CPC certification. Warehouses in USA, Canada, Germany, Poland, UK, and Japan.",
    },
  },

  communityplaythings: {
    id: "communityplaythings",
    name: "Community Playthings",
    website: "https://communityplaythings.com",
    country: "ABD (USA)",
    address: "Route 213, Rifton, New York 12471, USA",
    phone: "+1 800-777-4244",
    email: "orders@communityplaythings.com",
    owner: "Bruderhof Community (Community Products, LLC)",
    founded: "1947",
    facebook: "https://www.facebook.com/CommunityPlaythings",
    pinterest: "https://www.pinterest.com/communityplay",
    youtube: "https://www.youtube.com/user/CommunityPlaythings",
    notes: "1920'de Almanya'da Eberhard Arnold tarafından kurulan Bruderhof Hristiyan topluluğu tarafından işletilmektedir. Tüzel kişilik: Community Products, LLC. New York ve Pennsylvania'da üretim atölyeleri. 1947'den bu yana okul öncesi ve kreş mobilyası üretimi. Rifton'daki Woodcrest Bruderhof topluluğunda merkez.",
    description: {
      tr: "Community Playthings, 1947'den bu yana Bruderhof Hristiyan topluluğu tarafından işletilen çocuk mobilyası üreticisidir. New York Rifton'daki Woodcrest topluluğu merkezlidir. New York ve Pennsylvania'da üretim yapar. Okul öncesi eğitim, kreş ve çocuk merkezlerine yönelik dayanıklı ahşap mobilya ve oyun malzemeleri üretir.",
      en: "Community Playthings has been operated by the Bruderhof Christian community since 1947, headquartered at the Woodcrest community in Rifton, New York. They manufacture durable wooden furniture and play materials for early childhood education, daycare, and children's centers in workshops across New York and Pennsylvania.",
    },
  },

  plywoodproject: {
    id: "plywoodproject",
    name: "Plywood Project",
    website: "https://plywoodproject.com",
    country: "Polonya (Poland)",
    address: "ul. Unii Lubelskiej 3, 61-249 Poznań, Polonya",
    phone: "+48 609 767 553",
    email: "contact@plywoodproject.com",
    taxId: "NIP: 784-235-74-10, REGON: 366130176",
    owner: "Dariusz Gapski",
    notes: "Polonya Poznań merkezli el yapımı kontraplak çocuk mobilyaları üreticisi. Ticari unvan: Plywood Project Dariusz Gapski. Montessori mobilya, kitaplık, oyuncak depolama ve çocuk masaları üretimi.",
    description: {
      tr: "Plywood Project, Polonya'nın Poznań şehrinde Dariusz Gapski tarafından işletilen el yapımı kontraplak çocuk mobilyaları üreticisidir. Montessori mobilya, kitaplık, oyuncak depolama üniteleri ve çocuk masaları üretmektedir.",
      en: "Plywood Project is a handmade plywood children's furniture producer based in Poznań, Poland, operated by Dariusz Gapski. They manufacture Montessori furniture, bookshelves, toy storage units, and children's desks.",
    },
  },

  woodandroom: {
    id: "woodandroom",
    name: "Wood and Room",
    website: "https://woodandroom.net",
    country: "Ukrayna (Ukraine)",
    address: "Ukrayna",
    email: "Etsy üzerinden iletişim",
    owner: "Alina & Andrew",
    instagram: "https://www.instagram.com/wood_and_room",
    etsy: "https://www.etsy.com/shop/WoodandRoomUA",
    notes: "Ukrayna merkezli Montessori ahşap mobilya ve oyuncak üreticisi. Etsy'de WoodandRoomUA mağazası ile 5.300+ yorum ve 30.000+ satış. Tırmanma kemerleri, denge tahtaları, kitaplıklar, oyuncak depolama üniteleri. Montessori, Pikler ve Waldorf eğitim metotlarına dayalı tasarımlar.",
    description: {
      tr: "Wood and Room, Ukrayna merkezli Montessori ahşap mobilya ve oyuncak üreticisidir. Alina ve Andrew tarafından yönetilen marka, Etsy'de WoodandRoomUA adıyla 30.000'den fazla ürün satmıştır. Tırmanma kemerleri, denge tahtaları, kitaplıklar ve eğitim amaçlı oyuncaklar üretmektedir.",
      en: "Wood and Room is a Ukrainian Montessori wooden furniture and toy manufacturer. Run by Alina and Andrew, the brand has sold over 30,000 products on Etsy as WoodandRoomUA. They produce climbing arches, balance boards, bookshelves, and educational toys based on Montessori, Pikler, and Waldorf methods.",
    },
  },

  saboconcept: {
    id: "saboconcept",
    name: "SABO Concept",
    website: "https://saboconcept.com",
    country: "Ukrayna (Ukraine)",
    address: "17 Kovpaka Street, Poltava, Poltava region, Ukrayna",
    phone: "+380 97 222 80 91",
    whatsapp: "+380 97 222 80 91",
    email: "info@saboconcept.com",
    owner: "Elena Bohush (Tasarımcı) & Dmitriy Salo (Ahşap Ustası)",
    instagram: "https://www.instagram.com/saboconcept",
    facebook: "https://www.facebook.com/saboconcept",
    etsy: "https://www.etsy.com/shop/SABOconcept",
    notes: "Ukrayna Poltava merkezli. Elena Bohush ve eşi Dmitriy Salo tarafından kurulan aile işletmesi. Çevre dostu ahşap oyuncaklar, mutfak oyun setleri ve Montessori tarzı çocuk ürünleri.",
    description: {
      tr: "SABO Concept, Ukrayna'nın Poltava şehrinde Elena Bohush (tasarımcı) ve Dmitriy Salo (ahşap ustası) çifti tarafından kurulan çevre dostu ahşap oyuncak markasıdır. Ahşap mutfak oyun setleri, Montessori tarzı oyuncaklar ve çocuk mobilyaları üretmektedir. Hem kendi web sitesi hem de Etsy üzerinden uluslararası satış yapmaktadır.",
      en: "SABO Concept is an eco-friendly wooden toy brand founded by married couple Elena Bohush (designer) and Dmitriy Salo (wood craftsman) in Poltava, Ukraine. They produce wooden kitchen play sets, Montessori-style toys, and children's furniture, selling internationally through their website and Etsy.",
    },
  },

  woodened: {
    id: "woodened",
    name: "Wooden Educational Toy",
    website: "https://www.etsy.com/shop/WoodenEducationalToy",
    country: "İsrail (Israel)",
    address: "Rehovot, İsrail",
    email: "woodeneducationaltoy@gmail.com",
    owner: "Nadia",
    etsy: "https://www.etsy.com/shop/WoodenEducationalToy",
    notes: "İsrail Rehovot merkezli. Etsy Star Seller. 3.800+ yorum, 17.600+ satış, 7 yıldır Etsy'de aktif. Pinkoi'de de mağazası mevcut (en.pinkoi.com/store/woodeneducationaltoy). Ahşap eğitim oyuncakları ve Montessori materyalleri.",
    description: {
      tr: "Wooden Educational Toy, İsrail'in Rehovot şehrinde Nadia tarafından işletilen ahşap eğitim oyuncakları üreticisidir. Etsy Star Seller statüsüne sahip mağaza, 17.600'den fazla satış gerçekleştirmiştir. Montessori materyalleri, ahşap yapbozlar ve eğitim amaçlı oyuncaklar üretmektedir.",
      en: "Wooden Educational Toy is a wooden educational toy producer run by Nadia in Rehovot, Israel. An Etsy Star Seller with over 17,600 sales, the shop produces Montessori materials, wooden puzzles, and educational toys. Also available on Pinkoi.",
    },
  },

  woodjoycollection: {
    id: "woodjoycollection",
    name: "Woodjoy Collection",
    website: "https://www.etsy.com/shop/WoodjoyCollection",
    country: "Romanya (Romania)",
    address: "Acatari 123, 547005, Mures, Romanya",
    phone: "+40 726 70 31 23",
    email: "evagyorki@timural.ro",
    owner: "Eva Gyorki (Timural Group SRL)",
    etsy: "https://www.etsy.com/shop/WoodjoyCollection",
    founded: "2010 (ana şirket Timural Group 2003)",
    notes: "Romanya Mures merkezli. Ana şirket: Timural Group SRL (2003'te kuruldu). Woodjoy markası 2010'dan beri faaliyet gösteriyor. Eva Gyorki tarafından yönetilmektedir. Ahşap Montessori mobilya, tırmanma oyuncakları ve çocuk odası ürünleri.",
    description: {
      tr: "Woodjoy Collection, Romanya'nın Mures bölgesinde Eva Gyorki tarafından yönetilen Timural Group SRL'ye ait ahşap çocuk mobilyası markasıdır. 2010'dan bu yana Montessori tırmanma oyuncakları, çocuk masaları, kitaplıklar ve oyuncak depolama üniteleri üretmektedir.",
      en: "Woodjoy Collection is a wooden children's furniture brand owned by Timural Group SRL, managed by Eva Gyorki in the Mures region of Romania. Since 2010, they have been producing Montessori climbing toys, children's desks, bookshelves, and toy storage units.",
    },
  },
};

/** Return the manufacturer for a given top-level category id */
export function getManufacturer(categoryId: string): Manufacturer | null {
  return manufacturers[categoryId] ?? null;
}
