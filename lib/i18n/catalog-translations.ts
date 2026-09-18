export interface PlaceI18n {
  name: string;
  summary: string;
  address: string;
  priceLabel: string;
  voucherOffer: string;
}

export interface HomestayI18n {
  name: string;
  village: string;
  capacity: string;
  amenities: string[];
}

export interface ProductI18n {
  name: string;
  category: string;
  description: string;
  specs: string[];
}

export interface BlogI18n {
  title: string;
  category: string;
  excerpt: string;
}

export interface TestimonialI18n {
  quote: string;
  name: string;
  role: string;
}

/**
 * High-quality English translations for all 14 A Luoi destinations
 */
export const placeTranslations: Record<string, PlaceI18n> = {
  "thac-a-nor": {
    name: "A Nor Waterfall",
    summary:
      "A majestic 3-tier natural waterfall nestled within pristine rainforest, renowned for emerald swimming pools and tranquil nature retreats.",
    address: "A Nor Village, Hong Kim Commune, A Luoi District, Thua Thien Hue",
    priceLabel: "Services from 220,000₫/person",
    voucherOffer: "10% off local tour guide & ethnic feast set"
  },
  "suoi-a-lin": {
    name: "A Lin Stream",
    summary:
      "A picturesque freshwater stream with flat rock beds, crystal-clear water, and lush canopy ideal for peaceful family picnics.",
    address: "Hong Trung Commune, A Luoi District, Thua Thien Hue",
    priceLabel: "From 150,000₫/person",
    voucherOffer: "50,000₫ discount for groups of 5+ guests"
  },
  "suoi-par-le": {
    name: "Par Le Stream",
    summary:
      "An emerald ecological gem in Hong Ha featuring expansive natural rock pools, exciting cliff jumps, and crystalline mountain water.",
    address: "Hong Ha Commune, A Luoi District, Thua Thien Hue",
    priceLabel: "Entry & services from 180,000₫/person",
    voucherOffer: "10% off entry ticket + riverside BBQ combo"
  },
  "rung-nguyen-sinh-a-roang": {
    name: "A Roang Primeval Forest",
    summary:
      "An invigorating trek across ancient Truong Son rainforest, discovering rare tropical flora and soaking in natural geothermal hot springs.",
    address: "A Roang Commune, A Luoi District, Thua Thien Hue",
    priceLabel: "Trekking tour from 450,000₫/person",
    voucherOffer: "10% off tour fare for groups of 4+ guests"
  },
  "lang-du-lich-cong-dong-a-nor": {
    name: "A Nor Community Tourism Village",
    summary:
      "A flagship community ecotourism model combining traditional stilt house stays, waterfall exploration, and authentic Pa Co cultural immersion.",
    address: "A Nor Hamlet, Hong Kim Commune, A Luoi District, Thua Thien Hue",
    priceLabel: "All-inclusive package from 380,000₫/person",
    voucherOffer: "10% off all-inclusive cultural & lodging package"
  },
  "lua-trai-van-nghe-a-nor": {
    name: "Campfire & Folk Music Performance",
    summary:
      "Resonant gong festivities, mystical Ra Zooc folk dances, traditional bamboo panpipes, and herbal tube wine by glowing embers.",
    address: "A Nor Community Square, Hong Kim, A Luoi, Thua Thien Hue",
    priceLabel: "Group package from 1,500,000₫",
    voucherOffer: "Complimentary large jar of tube wine for groups of 10+"
  },
  "homestay-ven-suoi-a-nor": {
    name: "A Nor Streamside Homestay",
    summary:
      "A peaceful wooden stilt homestay perched right beside a babbling brook, offering restorative sleep amidst fresh mountain air.",
    address: "A Nor Hamlet, Hong Kim Commune, A Luoi District, Thua Thien Hue",
    priceLabel: "From 620,000₫/night (2-4 guests)",
    voucherOffer: "10% off room rate when booking via Cham A Luoi"
  },
  "quan-com-pa-co": {
    name: "Pa Co Ethnic Cuisine Restaurant",
    summary:
      "A hearty highland culinary feast featuring bamboo-tube sticky rice, mountain-herb grilled chicken, stream fish, and wild forest greens.",
    address: "Ho Chi Minh Highway, A Luoi Town, Thua Thien Hue",
    priceLabel: "Set menu from 120,000₫ - 250,000₫/person",
    voucherOffer: "Complimentary pot of mountain herbal tea & fresh fruit platter"
  },
  "workshop-det-zeng-ta-oi": {
    name: "Ta Oi Zeng Weaving Experience",
    summary:
      "Observe and hand-thread intricate lead beads into authentic Zeng textiles — recognized as a National Intangible Cultural Heritage.",
    address: "Zeng Craft Village, Lam Dot Commune, A Luoi District, Thua Thien Hue",
    priceLabel: "Experience pass from 180,000₫/person",
    voucherOffer: "10% off all handmade Zeng scarves and bags at workshop"
  },
  "cau-treo-pi-lung": {
    name: "Pi Lung Suspension Bridge & Pe Ke Pass",
    summary:
      "A graceful suspension bridge linking two riverbanks amidst untouched wilderness, ideal for sunrise cloud-hunting and sunset vistas.",
    address: "Pi Lung Area, A Roang Commune, A Luoi District, Thua Thien Hue",
    priceLabel: "Route combo from 120,000₫/person",
    voucherOffer: "Complimentary drone / DSLR photo package for groups of 6+"
  },
  "xe-dua-don-hue-a-luoi": {
    name: "Hue - A Luoi Shuttle Transfer Service",
    summary:
      "Comfortable 7-seat & 16-seat fleet with experienced local drivers navigating mountain passes safely door-to-door from Hue.",
    address: "Hue Central Bus Station & A Luoi Town",
    priceLabel: "Private car from 850,000₫, shared from 120,000₫/seat",
    voucherOffer: "50,000₫ discount on your first round-trip booked online"
  },
  "mat-ong-rung-a-luoi": {
    name: "Pure A Luoi Wild Forest Honey",
    summary:
      "Raw, golden wild cliff-honey harvested naturally by Pa Co foragers in the Truong Son primeval forest, naturally sweet and rich in enzymes.",
    address: "A Luoi Central Market, A Luoi Town, Thua Thien Hue",
    priceLabel: "240,000₫/500ml - 450,000₫/liter",
    voucherOffer: "10% off when purchasing 2 or more bottles"
  },
  "tra-nui-thao-moc-a-luoi": {
    name: "Highland Herbal Tea (Tra Day & Sam Cau)",
    summary:
      "A precious mountain herbal infusion hand-picked from high peaks, promoting restful sleep, digestion, and natural revitalization.",
    address: "A Ngo Commune, A Luoi District, Thua Thien Hue",
    priceLabel: "140,000₫/300g pack",
    voucherOffer: "Buy 3 packs and receive 1 free mini tea sampler pack"
  },
  "dac-san-thit-bo-ruou-can-a-luoi": {
    name: "Smoked Highland Beef & Traditional Tube Wine",
    summary:
      "Woodsmoke-cured grassland beef paired with naturally leaf-fermented herbal tube wine for an authentic taste of western Hue.",
    address: "A Luoi Town, A Luoi District, Thua Thien Hue",
    priceLabel: "Smoked beef from 420,000₫/500g, Tube wine from 220,000₫/jar",
    voucherOffer: "10% off combo of 1kg smoked beef + 1 jar of tube wine"
  }
};

/**
 * English translations for Featured Homestays
 */
export const homestayTranslations: Record<string, HomestayI18n> = {
  "a-nor-stream-homestay": {
    name: "A Nor Streamside Homestay",
    village: "A Nor Village",
    capacity: "12 guests",
    amenities: ["Breakfast", "WiFi", "Private Bathroom", "Campfire", "Traditional Dinner"]
  },
  "ta-oi-mountain-lodge": {
    name: "Ta Oi Mountain Lodge",
    village: "Ta Oi Village",
    capacity: "10 guests",
    amenities: ["Breakfast", "Bicycle Rental", "Private Bathroom", "Campfire", "Traditional Dinner"]
  },
  "pa-co-heritage-home": {
    name: "Pa Co Heritage Home",
    village: "Pa Co Village",
    capacity: "14 guests",
    amenities: ["Breakfast", "WiFi", "Campfire", "Bicycle Rental", "Traditional Dinner"]
  },
  "cloud-hill-retreat": {
    name: "Cloud Hill Retreat",
    village: "Hong Van Commune",
    capacity: "8 guests",
    amenities: ["Breakfast", "WiFi", "Private Bathroom", "Bicycle Rental", "Traditional Dinner"]
  }
};

/**
 * English translations for Local Specialties & Products
 */
export const productTranslations: Record<string, ProductI18n> = {
  "traditional-zeng-brocade": {
    name: "Traditional Zeng Brocade",
    category: "Traditional Brocade",
    description: "Handwoven by Ta Oi artisans with ancestral cultural motifs and lead beadwork.",
    specs: ["Cotton blend yarn", "Indigenous motifs", "Handcrafted", "Community product"]
  },
  "forest-honey": {
    name: "A Luoi Wild Forest Honey",
    category: "Wild Forest Honey",
    description: "Pure golden raw honey harvested from ancient highland forests of A Luoi.",
    specs: ["500ml glass bottle", "Raw unprocessed honey", "Zero additives", "Seasonal harvest"]
  },
  "mountain-tea": {
    name: "Highland Herbal Mountain Tea",
    category: "Mountain Herbal Tea",
    description: "Gentle mountain tea blended with wild local herbs, offering a soothing aftertaste.",
    specs: ["120g pack", "Herbal blend", "Low caffeine", "Hand-selected"]
  },
  "bamboo-craft-basket": {
    name: "Handcrafted Bamboo Basket",
    category: "Bamboo Handicrafts",
    description: "Durable natural bamboo basket, crafted for home decor, storage, and memorable gifts.",
    specs: ["Natural bamboo", "Hand-finished", "Lightweight", "Eco-reusable"]
  }
};

/**
 * English translations for Blog Posts
 */
export const blogTranslations: Record<string, BlogI18n> = {
  "first-time-guide-to-a-luoi": {
    title: "First-Timer's Guide to Exploring A Luoi",
    category: "Travel Guide",
    excerpt: "How to plan a gentle, respectful journey through waterfalls, ethnic hamlets, and misty passes."
  },
  "zeng-weaving-ta-oi-artisans": {
    title: "Zeng Weaving & Stories Behind Every Pattern",
    category: "Culture",
    excerpt: "Traditional Zeng preserves ancestral memories, ethnic identity, and the dedication of Ta Oi women."
  },
  "local-cuisine-in-the-highlands": {
    title: "What to Eat in the A Luoi Highlands",
    category: "Cuisine",
    excerpt: "Woodsmoke grilled specialties, wild forest vegetables, sticky rice, and heartfelt mountain hospitality."
  }
};

/**
 * English translations for Testimonials
 */
export const testimonialTranslations: TestimonialI18n[] = [
  {
    quote: "The itinerary was thoughtfully crafted with immense cultural depth. We felt connected to the heritage before even booking specific stops.",
    name: "An Pham",
    role: "Tourism Student"
  },
  {
    quote: "Breathtaking natural scenery, heartwarming hosts, and a straightforward booking process that was easy to follow.",
    name: "Minh Le",
    role: "Family Traveler"
  },
  {
    quote: "The night at the stilt homestay and the Zeng weaving workshop were by far the highlights of our entire trip to Hue.",
    name: "Sarah Collins",
    role: "Cultural Enthusiast"
  }
];

/**
 * Translations for the /products page
 */
export const productPageTranslations = {
  vi: {
    eyebrow: "Gian hàng địa phương",
    title: "Sản phẩm A Lưới",
    description: "Khám phá Zèng truyền thống, mật ong rừng già, trà núi thảo mộc, thủ công tre, sản phẩm OCOP và quà lưu niệm từ A Lưới.",
    categories: ["Tất cả", "Zèng truyền thống", "Mật ong rừng", "Trà núi", "Thủ công tre", "OCOP", "Quà lưu niệm"],
    orderNow: "Đặt hàng ngay",
    viewDetails: "Xem chi tiết",
    communitySupportTitle: "Mua hàng hỗ trợ cộng đồng",
    communitySupportDesc: "Mỗi đơn hàng giúp tăng đầu ra cho sản phẩm địa phương và tạo thêm thu nhập cho nghệ nhân, hộ gia đình tại A Lưới.",
    productInfoTitle: "Thông tin sản phẩm",
    orderRequestTitle: "Gửi yêu cầu mua hàng"
  },
  en: {
    eyebrow: "Local Highland Marketplace",
    title: "A Luoi Specialties & Crafts",
    description: "Discover authentic handwoven Zeng brocade, wild forest honey, mountain herbal tea, bamboo crafts, OCOP products and souvenirs from A Luoi.",
    categories: ["All", "Traditional Brocade", "Wild Forest Honey", "Mountain Herbal Tea", "Bamboo Crafts", "OCOP Certified", "Souvenirs"],
    orderNow: "Order Now",
    viewDetails: "View Details",
    communitySupportTitle: "Shop to Support Indigenous Communities",
    communitySupportDesc: "Every order directly creates sustainable livelihood and fair income for local artisans and ethnic minority families in A Luoi.",
    productInfoTitle: "Product Specifications",
    orderRequestTitle: "Submit Purchase Request"
  }
};
