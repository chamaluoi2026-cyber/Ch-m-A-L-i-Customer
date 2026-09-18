export type TripDuration = "1-day" | "2-days" | "3-days";
export type TransportType = "motorbike" | "car";
export type TravelCompanion = "solo" | "couple" | "family" | "friends";
export type DepartureTime = "06:30" | "07:30" | "08:30" | "13:30";

export const DEPARTURE_TIME_OPTIONS = [
  {
    id: "06:30",
    label: "06:30 - Sáng sớm săn mây",
    enLabel: "06:30 - Early Bird",
    desc: "Săn mây đèo A Co & trọn vẹn cả ngày",
    enDesc: "Sunrise clouds & full day"
  },
  {
    id: "07:30",
    label: "07:30 - Sáng thong thả (Khuyên dùng)",
    enLabel: "07:30 - Standard (Recommended)",
    desc: "Đủ thời gian ăn sáng ở Huế trước khi lên đèo",
    enDesc: "Breakfast in Hue then depart"
  },
  {
    id: "08:30",
    label: "08:30 - Sáng thong dong",
    enLabel: "08:30 - Relaxed Morning",
    desc: "Nghỉ ngơi thoải mái, không cần dậy sớm",
    enDesc: "Sleep in and start comfortably"
  },
  {
    id: "13:30",
    label: "13:30 - Buổi chiều",
    enLabel: "13:30 - Afternoon Departure",
    desc: "Sau bữa trưa ở Huế, lên nhận phòng & ngắm hoàng hôn",
    enDesc: "Depart after lunch in Hue"
  }
];

export interface ExperienceChoice {
  id: string;
  icon: string;
  label: string;
  enLabel: string;
  description: string;
  enDescription: string;
  tags: string[];
}

export const LIKE_CHOICES: ExperienceChoice[] = [
  {
    id: "waterfalls",
    icon: "🌊",
    label: "Tắm thác & ngâm suối ngọc",
    enLabel: "Waterfalls & Crystal Streams",
    description: "Thác A Nôr 3 tầng, suối Pâr Le, suối A Lin hoang sơ",
    enDescription: "3-tier A Nor falls, pristine Par Le & A Lin streams",
    tags: ["thac", "suoi", "waterfall", "boi-loi"]
  },
  {
    id: "hotspring",
    icon: "♨️",
    label: "Suối khoáng nóng A Roàng",
    enLabel: "Geothermal Hot Springs",
    description: "Nước khoáng nóng 60-70°C phục hồi cơ thể, giãn nở gân cốt",
    enDescription: "Natural 60-70°C spring water to rejuvenate",
    tags: ["khoang-nong", "a-roang", "hot-spring"]
  },
  {
    id: "zeng",
    icon: "🧵",
    label: "Thổ cẩm Dèng Tà Ôi (Di sản)",
    enLabel: "Sacred Zèng Weaving",
    description: "Nghệ thuật đính cườm thủ công di sản quốc gia tại A Đớt",
    enDescription: "National intangible heritage beadwork in A Dot",
    tags: ["van-hoa", "lang-nghe", "zeng"]
  },
  {
    id: "clouds",
    icon: "☁️",
    label: "Săn mây Đồi Thông & cắm trại",
    enLabel: "Cloud Hunting & Pine Hill",
    description: "Cảnh quan se lạnh, đồi thông thơ mộng như Đà Lạt thu nhỏ",
    enDescription: "Misty highlands and romantic pine groves",
    tags: ["doi-thong", "san-may", "checkin"]
  },
  {
    id: "campfire",
    icon: "🔥",
    label: "Lửa trại & cồng chiêng đêm",
    enLabel: "Campfire & Sacred Gongs",
    description: "Giao lưu điệu Ra Zooc bên bếp lửa nhà sàn Pa Cô",
    enDescription: "Fireside music and Ra Zooc tribal dance",
    tags: ["lua-trai", "cong-chieng", "am-nhac"]
  },
  {
    id: "cuisine",
    icon: "🍗",
    label: "Ẩm thực cơm lam, gà nướng",
    enLabel: "Authentic Highland Feast",
    description: "Bánh A Quát, cá suối nướng muối tiêu rừng, măng tươi",
    enDescription: "Bamboo rice, roast hill chicken, wild pepper spices",
    tags: ["an-uong", "am-thuc", "banh-a-quat"]
  },
  {
    id: "history",
    icon: "🎖️",
    label: "Chiến trường xưa (Đồi A Bia)",
    enLabel: "Hamburger Hill Battlefield",
    description: "Di tích lịch sử kháng chiến oai hùng & thung lũng A Shau",
    enDescription: "Historic Hill 937 of the Vietnam War",
    tags: ["lich-su", "a-bia", "hamburger-hill"]
  }
];

export const DISLIKE_CHOICES: ExperienceChoice[] = [
  {
    id: "avoid-hiking",
    icon: "🚷",
    label: "Ngại leo dốc cao, trekking mệt",
    enLabel: "No steep hikes / trekking",
    description: "Ưu tiên điểm xe đến sát nơi, đi bộ nhẹ nhàng",
    enDescription: "Prefer easy access with minimal uphill walking",
    tags: ["hiking", "trekking", "leo-nui"]
  },
  {
    id: "avoid-curves",
    icon: "🛑",
    label: "Say xe / ngại đèo quanh co sâu",
    enLabel: "Motion sickness / avoid deep passes",
    description: "Hạn chế đi sâu vào A Roàng, tập trung trung tâm thung lũng",
    enDescription: "Stay around main valley, limit long winding roads",
    tags: ["deo-sau", "a-roang-xa"]
  },
  {
    id: "avoid-alcohol",
    icon: "🚫",
    label: "Kiêng rượu bia / không ăn cay",
    enLabel: "No alcohol / non-spicy meals",
    description: "Bỏ rượu Đoác/cần, chọn mâm cơm thanh đạm, trà thảo mộc",
    enDescription: "Skip local wine, serve mild & wholesome herbal tea",
    tags: ["ruou", "cay-nong"]
  },
  {
    id: "avoid-crowds",
    icon: "🧘",
    label: "Tránh ồn ào đông đúc",
    enLabel: "Avoid crowded / loud spots",
    description: "Ưu tiên không gian yên tĩnh, hòa mình cùng suối rừng vắng",
    enDescription: "Seek peaceful, secluded natural hideaways",
    tags: ["on-ao", "dong-duc"]
  },
  {
    id: "avoid-insects",
    icon: "🦟",
    label: "Dị ứng côn trùng / sợ vắt rừng",
    enLabel: "Fear of forest insects / leeches",
    description: "Không cắm trại rừng mùa mưa, ở phòng homestay khép kín",
    enDescription: "Avoid wild rainforest trails, stay in sealed rooms",
    tags: ["rung-sau", "con-trung"]
  }
];

export interface ItineraryStop {
  id: string;
  timeSlot: string;
  name: string;
  enName: string;
  slug: string;
  category: string;
  image: string;
  duration: string;
  distanceFromPrev: string;
  travelTimeFromPrev?: string;
  summary: string;
  enSummary: string;
  wisdomTip: string;
  enWisdomTip: string;
  energyLevel: "easy" | "moderate" | "challenging";
  googleMapsQuery: string;
  isTravelLeg?: boolean;
  stopType?: "travel" | "visit" | "checkin" | "checkout" | "rest" | "meal" | "breakfast" | "coffee";
  mustTry?: string[];
  enMustTry?: string[];
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  enTitle: string;
  theme: string;
  enTheme: string;
  stops: ItineraryStop[];
}

export interface WeatherAdvisory {
  seasonName: string;
  enSeasonName: string;
  conditionSummary: string;
  enConditionSummary: string;
  tempRange: string;
  rainRisk: "low" | "medium" | "high";
  cloudHuntingRating: "excellent" | "fair" | "low";
  aiAlerts: string[];
  enAiAlerts?: string[];
  adaptiveActions: string[];
  enAdaptiveActions?: string[];
}

export interface ItineraryPlan {
  isGeminiPowered?: boolean;
  geminiIntro?: string;
  enGeminiIntro?: string;
  weatherAdvisory?: WeatherAdvisory;
  id: string;
  title: string;
  enTitle: string;
  duration: TripDuration;
  departureTime?: DepartureTime;
  transport: TransportType;
  companion: TravelCompanion;
  totalDistanceKm: number;
  energyRating: "easy" | "moderate" | "challenging";
  estBudgetPerPerson: number;
  days: ItineraryDay[];
  likes: string[];
  dislikes: string[];
  safetyTips: string[];
  enSafetyTips: string[];
  culturalRules: string[];
  enCulturalRules: string[];
  packingList: string[];
  enPackingList: string[];
}

/**
 * Thuật toán AI cá nhân hóa lịch trình du lịch A Lưới
 * - Tự động thay đổi 100% các điểm đến dựa trên tổ hợp:
 *   Sở thích (Likes) + Điểm muốn tránh (Dislikes) + Bạn đồng hành (Companion) + Phương tiện (Transport) + Thời gian (Duration)
 * - Tích hợp thời gian di chuyển chuẩn xác từ trung tâm TP. Huế qua đèo QL49
 */
export function generateHighlandItinerary(params: {
  duration: TripDuration;
  transport: TransportType;
  companion: TravelCompanion;
  departureTime?: DepartureTime;
  likes: string[];
  dislikes: string[];
  isRainy?: boolean;
  weatherForecast?: { condition: string; tempMax: number; tempMin: number; rainChance: number };
}): ItineraryPlan {
  const { duration, transport, companion, likes, dislikes, departureTime = "07:30", isRainy = false, weatherForecast } = params;

  const currentMonth = new Date().getMonth() + 1; // 1 - 12
  const isWetSeason = currentMonth >= 9 && currentMonth <= 11;
  const isColdMistSeason = currentMonth === 12 || currentMonth <= 2;
  const isDrySummerSeason = currentMonth >= 3 && currentMonth <= 8;

  const avoidsHiking = dislikes.includes("avoid-hiking");
  const avoidsDeepCurves = dislikes.includes("avoid-curves");
  const avoidsAlcohol = dislikes.includes("avoid-alcohol");
  const avoidsCrowds = dislikes.includes("avoid-crowds");
  const avoidsInsects = dislikes.includes("avoid-insects");

  // Nếu trời mưa ẩm: Tự động ưu tiên Khoáng Nóng và Dệt Zèng trong nhà
  const likesHotspring = likes.includes("hotspring") || isRainy || isColdMistSeason;
  const likesZeng = likes.includes("zeng") || isRainy;
  const likesHistory = likes.includes("history");
  const likesClouds = likes.includes("clouds") || isColdMistSeason;
  const likesCampfire = likes.includes("campfire") && !isRainy;
  // Nếu mưa to thì hạn chế lội thác sâu trơn trượt
  const likesWaterfalls = (likes.includes("waterfalls") || likes.length === 0) && !isRainy;
  const likesCuisine = likes.includes("cuisine");

  // Thời gian di chuyển từ Huế lên A Lưới (70km đèo QL49)
  const travelDurationFromHue = transport === "motorbike" ? "2 giờ 15 phút" : "1 giờ 45 phút";
  const travelDistanceText = "70km từ trung tâm TP. Huế qua đèo QL49";

  // Xác định cấp độ thể lực
  let energyRating: "easy" | "moderate" | "challenging" = "moderate";
  if (avoidsHiking || companion === "family") {
    energyRating = "easy";
  } else if (!avoidsHiking && (likesHistory || duration === "3-days" || companion === "friends")) {
    energyRating = "challenging";
  }

  // Dự toán chi phí
  let estBudget = 550000;
  if (duration === "2-days") estBudget = 1350000;
  if (duration === "3-days") estBudget = 2150000;
  if (transport === "car") estBudget += 350000;
  if (companion === "couple") estBudget += 200000; // Phòng riêng tư bungalow

  const days: ItineraryDay[] = [];

  // =========================================================================
  // NGÀY 1: KHỞI HÀNH TỪ HUẾ & KHÁM PHÁ THEO GU
  // =========================================================================
  const day1Stops: ItineraryStop[] = [];

  // STOP 1.1: CHẶNG DI CHUYỂN TỪ TRUNG TÂM HUẾ
  day1Stops.push({
    id: "xuat-phat-tu-hue",
    timeSlot: transport === "motorbike" ? "07:00 - 09:15" : "07:30 - 09:15",
    name: "Khởi Hành Từ TP. Huế -> Vượt Cung Đèo QL49 Lên A Lưới",
    enName: "Departure from Hue City -> Scenic QL49 Pass to A Luoi",
    slug: "dich-vu-xe-dua-don-hue-a-luoi",
    category: "Di chuyển",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
    duration: travelDurationFromHue,
    distanceFromPrev: travelDistanceText,
    travelTimeFromPrev: travelDurationFromHue,
    isTravelLeg: true,
    summary:
      transport === "motorbike"
        ? `Phượt xe máy vượt đèo QL49 dài 70km (mất khoảng ${travelDurationFromHue}). Khởi hành từ ngã ba Tuần / Bình Điền, dừng chân ngắm mây vắt ngang đỉnh đèo Mỏ Quạ và ngắm cảnh thung lũng sông Hương thu nhỏ.`
        : `Xe ô tô di chuyển êm ái khoảng ${travelDurationFromHue} từ trung tâm Huế lên cao nguyên A Lưới (độ cao 600m - 800m). Càng lên cao không khí càng se lạnh, trong lành khác hẳn vùng đồng bằng.`,
    enSummary: `Scenic drive from central Hue along Highway 49 taking approximately ${travelDurationFromHue} (70km). As you ascend to 700m elevation, feel the refreshing highland breeze.`,
    wisdomTip:
      transport === "motorbike"
        ? "Đổ đầy bình xăng tại ngã ba Bình Điền vì trên 30km đèo không có cây xăng. Chạy xe số 2-3, bật đèn pha khi qua các đoạn cua có sương mù."
        : "Đoạn đèo quanh co nhẹ nhàng, nếu có người say xe nên chuẩn bị kẹo gừng hoặc ngồi hàng ghế đầu cạnh tài xế.",
    enWisdomTip: "Fill up fuel tank before entering the mountain pass. Shift to low gears on descents and turn on headlights through misty curves.",
    energyLevel: "easy",
    googleMapsQuery: "Đèo A Co Quốc Lộ 49 A Lưới Thừa Thiên Huế",
    stopType: "travel",
    mustTry: [
      "🛢️ Đổ đầy bình xăng tại ngã ba Bình Điền trước khi vào đèo",
      "📸 Dừng ở Cột Km 32 trên đèo để chụp ảnh mây vắt ngang núi",
      "🍌 Ghé mua chuối rừng hoặc mía tươi từ người dân ven đường",
      "🌡️ Nhiệt độ giảm dần khi lên cao — mang thêm áo mỏng sẵn trong ba lô"
    ],
    enMustTry: [
      "🛢️ Fill tank at Binh Dien junction — no gas stations for 30km",
      "📸 Stop at Km 32 marker on the pass for cloud-draped mountain shots",
      "🍌 Buy fresh bananas or sugar cane from roadside villagers",
      "🌡️ Temperature drops as you climb — pack a light layer"
    ]
  });

  // STOP 1.2: ĐIỂM DỪNG CHÂN ĐẦU TIÊN (Phân hóa mạnh theo Likes & Companion)
  if (likesHotspring && !avoidsDeepCurves && duration !== "1-day") {
    // ƯU TIÊN HOTSPRING: Đi thẳng vào A Roàng để tắm khoáng phục hồi
    day1Stops.push({
      id: "khoang-nong-a-roang-day1",
      timeSlot: "10:00 - 13:30",
      name: "Suối Khoáng Nóng A Roàng & Bữa Trưa Người Cơ Tu",
      enName: "A Roang Geothermal Springs & Co Tu Lunch",
      slug: "rung-nguyen-sinh-a-roang",
      category: "Hoạt động ngoài trời",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
      duration: "3.5h",
      distanceFromPrev: "28km từ ngã ba thị trấn dọc đường mòn Hồ Chí Minh",
      summary: "Ngâm mình trong dòng khoáng nóng 60-70°C tự nhiên phun trào bên vách đá rừng già. Tắm khoáng nóng giúp tan biến hoàn toàn mỏi mệt sau chặng đường đèo từ Huế.",
      enSummary: "Soak in 60-70°C natural geothermal thermal springs flowing alongside ancient rainforest beds.",
      wisdomTip: "Nên ngâm từng đợt 15-20 phút, uống nhiều nước khoáng và có thể thử luộc trứng tại hố khoáng sôi tự nhiên.",
      enWisdomTip: "Alternate 15-minute mineral soaks with cool rests; don't miss boiling eggs in the natural thermal pool.",
      energyLevel: "easy",
      googleMapsQuery: "Suối khoáng nóng A Roàng A Lưới"
    });
  } else if (likesZeng && !likesWaterfalls) {
    // ƯU TIÊN VĂN HÓA DỆT ZÈNG
    day1Stops.push({
      id: "lang-nghe-zeng-day1",
      timeSlot: "09:45 - 12:00",
      name: "Không Gian Di Sản Dệt Dèng Thổ Cẩm Tà Ôi (A Đớt)",
      enName: "National Heritage Zèng Weaving Village (A Dot)",
      slug: "trai-nghiem-det-zeng-ta-oi",
      category: "Văn hóa",
      image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
      duration: "2.25h",
      distanceFromPrev: "12km từ chân đèo A Co",
      summary: "Ghé thăm cái nôi dệt thổ cẩm Zèng đính cườm nổi tiếng. Giao lưu cùng các nghệ nhân già làng Tà Ôi, lắng nghe câu chuyện về từng họa tiết rồng, chim muông và tự tay xâu hạt cườm may mắn.",
      enSummary: "Immerse in indigenous bead-weaving artistry recognized as National Intangible Cultural Heritage.",
      wisdomTip: "Khăn Dèng dệt thủ công có giá trị lưu niệm và làm quà tặng rất cao, hỗ trợ trực tiếp thu nhập cho phụ nữ bản xứ.",
      enWisdomTip: "Authentic Zèng scarves make prized cultural keepsakes and directly empower local tribal artisans.",
      energyLevel: "easy",
      googleMapsQuery: "Hợp tác xã dệt dèng A Lưới"
    });
  } else {
    // MẶC ĐỊNH HOẶC THÍCH SUỐI: Suối Pâr Le cửa ngõ Hồng Hạ
    day1Stops.push({
      id: "suoi-par-le-day1",
      timeSlot: "09:30 - 12:00",
      name: companion === "family" ? "Suối Pâr Le (Khu Bãi Tắm Nông Gia Đình)" : "Suối Pâr Le & Trải Nghiệm Bơi Vịnh Ngọc",
      enName: "Pâr Le Natural Stream & Emerald Pools",
      slug: "suoi-par-le",
      category: "Thác và suối",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      duration: "2.5h",
      distanceFromPrev: "45km từ Huế (nằm ngay chân đèo Hồng Hạ)",
      travelTimeFromPrev: "1h15m từ Huế",
      summary:
        companion === "family"
          ? "Bãi tắm nông số 1 nước suối trong nhìn thấy đáy sỏi, rừng râm mát, an toàn cho trẻ nhỏ và người lớn tuổi dạo mát nghỉ chân."
          : "Vụng nước ngọc bích phẳng lặng bao quanh bởi tảng đá tự nhiên, nước mát lạnh 20°C xua tan cái nóng đồng bằng.",
      enSummary: "Crystal turquoise mountain creek with shaded pebble beaches, ideal for taking the first cooling dip right after the pass.",
      wisdomTip: "Nước suối Pâr Le rất trong, nên chuẩn bị sẵn quần áo bơi và túi chống nước cho điện thoại.",
      enWisdomTip: "Water is exceptionally clear; pack swimwear and a waterproof mobile pouch.",
      energyLevel: "easy",
      googleMapsQuery: "Suối Pâr Le Hồng Hạ A Lưới"
    });
  }

  // STOP 1.3: BỮA TRƯA BẢN ĐỊA (Tùy biến theo ẩm thực & người đi cùng)
  day1Stops.push({
    id: "bua-trua-ban-dia-day1",
    timeSlot: "12:15 - 13:45",
    name: likesCuisine ? "Đại Tiệc Ẩm Thực Vùng Cao: Gà Nướng, Cơm Lam & Bánh A Quát" : "Bữa Trưa Pa Cô: Cơm Lam & Gà Đồi Nướng Than",
    enName: "Highland Feast: Bamboo Rice & Roast Mountain Chicken",
    slug: "quan-com-ban-pa-co",
    category: "Ăn uống",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
    duration: "1.5h",
    distanceFromPrev: "8km - 15km",
    summary:
      avoidsAlcohol
        ? "Mâm cơm ấm cúng với gà đồi nướng mộc chấm muối hạt tiêu rừng, cá suối chiên giòn, xôi nếp than dẻo bùi và ấm trà vằng rừng hạ nhiệt."
        : "Thưởng thức gà thả đồi nướng than hoa thơm lừng, cơm lam nướng ống tre giòn vỏ, đĩa rau dớn rừng xào tỏi và nếm thử ngụm rượu Đoác ủ men tự nhiên.",
    enSummary: avoidsAlcohol
      ? "Savor charred hill chicken seasoned with wild mountain pepper, river fish, fragrant bamboo sticky rice, and hot forest herbal tea."
      : "Highland feast featuring wood-roasted free-range chicken, crispy river fish, wild fiddlehead fern, and a taste of natural Doac nectar.",
    wisdomTip: "Thịt gà bản A Lưới thả đồi tự nhiên thịt rất săn chắc, ăn cùng lá é và tiêu rừng tạo hương vị đặc trưng khó quên.",
    enWisdomTip: "Hill chicken is lean and savory; paired with wild mountain pepper it creates an unforgettable culinary memory.",
    energyLevel: "easy",
    googleMapsQuery: "Quán cơm bản Pa Cô A Lưới",
    stopType: "meal",
    mustTry: [
      "🍗 Gà kiến A Lưới (thả đồi, thịt săn chắc) — nướng than hoa hoặc luộc nước gừng",
      "🎋 Cơm lam ống tre nướng thơm — ăn kèm muối mè rang và lá é rừng",
      "🐟 Cá suối nướng muối tiêu rừng — nguyên con, da giòn vàng",
      "🌿 Canh rau dớn rừng hoặc canh thân chuối rừng — thanh mát, lạ miệng",
      "🍶 Nếm thử rượu Đoác — chỉ một ly để cảm nhận hương vị núi rừng Pa Cô"
    ],
    enMustTry: [
      "🍗 A Luoi 'ant chicken' free-range — grilled over charcoal or steamed with ginger",
      "🎋 Bamboo-tube sticky rice (cơm lam) — paired with sesame salt and forest basil",
      "🐟 River fish grilled whole with wild mountain pepper and sea salt",
      "🌿 Wild fiddlehead fern soup — refreshing highland broth",
      "🍶 Taste Doac palm wine — just a glass to experience Pa Co highland spirit"
    ]
  });

  // STOP 1.4: CHIỀU NGÀY 1 (Phân hóa mạnh)
  if (likesWaterfalls) {
    day1Stops.push({
      id: "thac-a-nor-chieu-day1",
      timeSlot: "14:15 - 17:00",
      name: "Thác A Nôr (Kỳ Quan 3 Tầng Nước Trắng)",
      enName: "A Nor 3-Tier Waterfall Exploration",
      slug: "thac-a-nor",
      category: "Thác và suối",
      image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80",
      duration: "2.75h",
      distanceFromPrev: "6km từ trung tâm thị trấn",
      summary:
        avoidsHiking
          ? "Dạo bước thư thái quanh chân thác tầng 1, ngồi chòi gỗ ven suối ngâm chân thảo mộc Pa Cô phục hồi sức khỏe."
          : "Chinh phục các tầng thác bọt nước tung trắng xóa, chèo thuyền phao cao su và bơi lội trong hồ tắm tự nhiên giữa rừng đại ngàn.",
      enSummary: "Magnificent 3-tier cascade enveloped in dense Truong Son jungle, offering rubber dinghy floats and herbal footbaths.",
      wisdomTip: "Nhiệt độ nước thác khoảng 19-21°C rất sảng khoái; nhớ khởi động nhẹ làm ấm cơ thể trước khi xuống tắm sâu.",
      enWisdomTip: "Waterfall temperature stays around 19-21°C; stretch and warm up gently before entering deep pools.",
      energyLevel: avoidsHiking ? "easy" : "moderate",
      googleMapsQuery: "Thác A Nôr Hồng Kim A Lưới"
    });
  } else if (likesHistory) {
    day1Stops.push({
      id: "san-bay-a-luoi-lich-su",
      timeSlot: "14:15 - 16:30",
      name: "Di Tích Lịch Sử Sân Bay Dã Chiến A Lưới & Thung Lũng A Shau",
      enName: "A Luoi Airfield Relic & A Shau Valley Panorama",
      slug: "doi-a-bia",
      category: "Tham quan",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      duration: "2.25h",
      distanceFromPrev: "4km",
      summary: "Chứng tích lịch sử huyền thoại trên tuyến đường mòn Hồ Chí Minh. Lắng nghe người cựu chiến binh bản địa kể về những năm tháng chiến tranh và ngắm toàn cảnh thung lũng A Shau thanh bình hôm nay.",
      enSummary: "Historic runway along the legend Ho Chi Minh trail, overlooking the tranquil modern expanse of A Shau Valley.",
      wisdomTip: "Nơi đây gió lộng và hoàng hôn buông trên dãy Trường Sơn rất đẹp để chụp ảnh lưu niệm.",
      enWisdomTip: "Wide open vantage point with dramatic sunset light over Truong Son ridge lines.",
      energyLevel: "easy",
      googleMapsQuery: "Sân bay A Lưới Thừa Thiên Huế"
    });
  } else {
    // THÍCH CẢNH QUAN / SĂN MÂY / THƯ THÁI: Cầu treo Pi Lung & Thôn A Ngo
    day1Stops.push({
      id: "cau-treo-pi-lung-chieu-day1",
      timeSlot: "14:30 - 16:45",
      name: "Cầu Treo Pi Lung & Dạo Ngắm Nương Rẫy Bản Làng",
      enName: "Pi Lung Suspension Bridge & Village Sunset Stroll",
      slug: "cau-treo-pi-lung-va-check-in",
      category: "Tham quan",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
      duration: "2.25h",
      distanceFromPrev: "5km",
      summary: "Cây cầu treo thanh bình bắc qua dòng sông Đakrông. Khung cảnh hoàng hôn êm ả với những nếp nhà sàn khói lam chiều và đàn trâu gặm cỏ bên nương ngô.",
      enSummary: "Rustic suspension bridge spanning river currents; peaceful afternoon golden hour across rice terraces and village roofs.",
      wisdomTip: "Đi bộ nhịp nhàng trên mặt ván cầu; chụp ảnh ngược sáng hoàng hôn tại đây cực kỳ điện ảnh.",
      enWisdomTip: "Walk steadily across wooden planks; exceptional backlit sunset photo spot.",
      energyLevel: "easy",
      googleMapsQuery: "Cầu treo Pi Lung A Lưới"
    });
  }

  // STOP 1.5: TỐI NGÀY 1 HOẶC KẾT THÚC TOUR 1 NGÀY
  if (duration === "1-day") {
    // Tour 1 ngày: Xuống đèo về Huế
    day1Stops.push({
      id: "ve-hue-chieu-day1",
      timeSlot: "16:45 - 18:45",
      name: "Khởi Hành Xuống Đèo QL49 Về Lại TP. Huế (70km)",
      enName: "Scenic Mountain Descent Along QL49 Back to Hue",
      slug: "dich-vu-xe-dua-don-hue-a-luoi",
      category: "Di chuyển",
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
      duration: travelDurationFromHue,
      distanceFromPrev: "70km xuống đèo về Huế",
      travelTimeFromPrev: travelDurationFromHue,
      isTravelLeg: true,
      summary: `Tạm biệt A Lưới, lên đường xuống núi sớm trước 17:00 để tránh sương mù đèo dày đặc. Về đến trung tâm TP. Huế khoảng ${transport === "motorbike" ? "19:00" : "18:30"}.`,
      enSummary: `Descend the pass before twilight mist sets in, safely arriving back in central Hue by dinner time (${travelDurationFromHue} travel).`,
      wisdomTip: "Nguyên tắc vàng: Xuất phát xuống đèo trước 17:00 để chạy xe dưới ánh sáng hoàng hôn an toàn, tránh sương mù che khuất tầm nhìn.",
      enWisdomTip: "Golden rule: start descending before 17:00 to navigate pass hairpins safely under daylight.",
      energyLevel: "easy",
      googleMapsQuery: "Thành phố Huế"
    });
  } else {
    // Tour 2 ngày hoặc 3 ngày: Tối lửa trại hoặc Homestay
    day1Stops.push({
      id: "dem-nghi-homestay-day1",
      timeSlot: "14:00 - 16:00",
      name:
        companion === "couple"
          ? "✅ Check-In Bungalow Gỗ Bên Suối \u0026 Thả Hồn Nghỉ Ngơi"
          : "✅ Check-In Nhà Sàn Homestay \u0026 Nhận Phòng Vùng Cao",
      enName: companion === "couple" ? "✅ Riverside Log Bungalow Check-In \u0026 Afternoon Rest" : "✅ Stilt House Homestay Check-In",
      slug: "lua-trai-va-van-nghe-dia-phuong",
      category: "Lưu trú",
      image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80",
      duration: "2.0h",
      distanceFromPrev: "2km - 4km",
      summary: "Nhận phòng homestay từ 14:00 theo giờ chuẩn (check-out trước 12:00 hôm sau). Thả ba lô xuống, tắm gội sảng khoái bằng nước suối mát lạnh, nghỉ ngơi lấy sức giữa tiếng gió rừng và suối reo. Homestay Hương Danh (A Roàng) và Anôr House (Hồng Kim) được đánh giá cao nhất với không gian nhà sàn truyền thống Pa Cô.",
      enSummary: "Standard check-in from 14:00 (check-out before 12:00 next day). Drop your bags, freshen up with cool mountain spring water, and rest in the timber stilt house as highland breezes drift in through bamboo walls.",
      wisdomTip: "Đặt trước lửa trại và cồng chiêng ngay khi nhận phòng — chủ nhà cần chuẩn bị củi và liên hệ nghệ nhân. Nếu đến sớm trước 14:00, chủ nhà thường giữ đồ và để khách dạo thăm bản làng trước.",
      enWisdomTip: "Book the campfire and gong performance right at check-in — hosts need time to gather firewood and contact tribal musicians. Arriving early? Leave bags with host and explore the village first.",
      energyLevel: "easy",
      googleMapsQuery: "Homestay A Nôr A Lưới",
      stopType: "checkin",
      mustTry: [
        "🏠 Thăm quan kiến trúc nhà sàn truyền thống Pa Cô / Tà Ôi",
        "🌊 Tắm suối ngay sau nhà sàn (nước trong, mát 20°C)",
        "☕ Uống trà vằng rừng nóng hổi do chủ nhà pha mời",
        likesCampfire ? "🔥 Xác nhận đặt lửa trại + cồng chiêng tối nay với chủ nhà" : "🌟 Ngắm sao đêm trên cao nguyên — cực kỳ rõ và đẹp (không ô nhiễm ánh sáng)",
        "📵 Tắt wifi, detox điện thoại, thưởng thức tiếng thiên nhiên thật sự"
      ],
      enMustTry: [
        "🏠 Tour the traditional Pa Co / Ta Oi stilt house architecture",
        "🌊 Swim in the clear 20°C stream right behind the homestay",
        "☕ Enjoy hot Vang forest herbal tea brewed by the host",
        likesCampfire ? "🔥 Confirm campfire + sacred gong booking with host for tonight" : "🌟 Stargaze on the highland — zero light pollution makes it magical",
        "📵 Unplug from wifi and soak in authentic natural soundscapes"
      ]
    });

    // STOP 1.6: TỐI NGÀY 1 - LỬA TRẠI / BỮA TỐI BẢN ĐỊA
    day1Stops.push({
      id: "toi-lua-trai-day1",
      timeSlot: "18:00 - 21:30",
      name:
        likesCampfire
          ? "🔥 Đêm Hội Lửa Trại \u0026 Cồng Chiêng Nhà Sàn A Nôr"
          : companion === "couple"
          ? "🌙 Tiệc Nướng BBQ Lãng Mạn \u0026 Hoàng Hôn Bên Suối"
          : "🍽️ Mâm Cơm Tối Bản Địa \u0026 Giao Lưu Văn Nghệ Pa Cô",
      enName: likesCampfire ? "🔥 Sacred Gongs \u0026 Campfire Night Under The Stars" : "🌙 Romantic BBQ Dinner \u0026 Creekside Sunset",
      slug: "lua-trai-va-van-nghe-dia-phuong",
      category: likesCampfire ? "Lửa trại" : "Ăn uống",
      image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80",
      duration: "3.5h",
      distanceFromPrev: "Ngay tại homestay",
      summary:
        likesCampfire
          ? "Ngọn lửa bập bùng giữa sân nhà sàn, tiếng cồng chiêng vang vọng núi rừng. Múa Ra Zooc truyền thống, nướng khoai sắn, nếm rượu Đoác và kể chuyện cùng già làng đến khuya."
          : companion === "couple"
          ? "Bữa tối thân mật bên ánh nến và tiếng suối, đồ nướng BBQ thơm ngon, ly rượu vang đỏ và bầu trời đầy sao ở độ cao 650m."
          : "Mâm cơm tối đủ đầy đặc sản vùng cao, giao lưu văn nghệ hát Then và múa dân tộc Tà Ôi cùng bà con.",
      enSummary: likesCampfire
        ? "Flames dance in the courtyard, sacred brass gongs resonate through mountain air. Traditional Ra Zooc dance, roasted sweet potato, and stories from village elders into the night."
        : "Intimate creekside dinner with highland BBQ, a glass of wine, and a sky dazzling with stars at 650m altitude.",
      wisdomTip: likesCampfire
        ? "Mặc quần dài và áo dài tay khi ngồi bên lửa trại — muỗi rừng hoạt động mạnh sau 18:00. Mang theo thuốc xịt côn trùng."
        : "Nhiệt độ về đêm 17-18°C — mang áo khoác ra ngoài và thưởng thức trà vằng nóng ấm bụng.",
      enWisdomTip: likesCampfire
        ? "Wear long sleeves and pants for the campfire — forest insects are active after sunset. Apply insect repellent beforehand."
        : "Night temperatures drop to 17-18°C — bring a fleece and enjoy hot Vang herbal tea.",
      energyLevel: "easy",
      googleMapsQuery: "Homestay A Nôr A Lưới",
      stopType: likesCampfire ? "visit" : "meal",
      mustTry: [
        likesCampfire ? "🔥 Nhảy theo điệu Ra Zooc cùng bà con — không cần biết múa!" : "🌃 Chụp ảnh long exposure bầu trời đêm đầy sao",
        "🥔 Nướng khoai sắn, bắp nương ngay trên than hồng lửa trại",
        "🥁 Nghe cồng chiêng — âm thanh linh thiêng được bảo tồn hàng trăm năm",
        "🍶 Nhâm nhi rượu Đoác lên men tự nhiên từ cây chà là rừng",
        "⭐ Ngắm sao trên cao nguyên — không khí trong sạch, nhìn cả Milky Way"
      ],
      enMustTry: [
        likesCampfire ? "🔥 Join the Ra Zooc dance circle — no experience needed!" : "🌃 Try long-exposure night photography of the star-filled sky",
        "🥔 Roast sweet potatoes and corn cobs directly on the campfire embers",
        "🥁 Listen to sacred gong ceremony — centuries-old tribal musical heritage",
        "🍶 Sip naturally-fermented Doac palm wine from bamboo cups",
        "⭐ Stargaze from the highland — clear air reveals the full Milky Way"
      ]
    });
  }

  days.push({
    dayNumber: 1,
    title:
      duration === "1-day"
        ? "Ngày 1: Vượt Đèo QL49 & Trọn Vẹn Một Ngày Chạm Đại Ngàn"
        : "Ngày 1: Cung Đèo Mây QL49 & Năng Lượng Rừng Già Trường Sơn",
    enTitle: duration === "1-day" ? "Day 1: Conquering Pass 49 & Full Day Highland Escape" : "Day 1: Highway 49 Ascent & Deep Mountain Energy",
    theme:
      duration === "1-day"
        ? "Khởi hành từ Huế • Thác suối mát lành • Khám phá ẩm thực bản địa trong ngày"
        : "Khởi hành từ Huế • Suối thác hoang sơ • Đêm lửa trại bản làng ấm áp",
    enTheme: "Departing Hue City • Pristine waterfalls • Tribal highland evening",
    stops: day1Stops
  });

  // =========================================================================
  // NGÀY 2: SĂN MÂY, KHOÁNG NÓNG HOẶC VĂN HÓA (Nếu >= 2 Ngày)
  // =========================================================================
  if (duration !== "1-day") {
    const day2Stops: ItineraryStop[] = [];

    // STOP 2.1: SÁNG SỚM - SĂN MÂY ĐỒI THÔNG (06:00 - 07:15)
    day2Stops.push({
      id: "san-may-doi-thong-day2",
      timeSlot: "06:00 - 07:30",
      name: likesClouds || companion === "couple"
        ? "☁️ Săn Biển Mây Đồi Thông A Lưới — Bình Minh Vùng Cao"
        : "🌅 Bình Minh Bản Làng \u0026 Dạo Qua Cầu Treo Pi Lung",
      enName: likesClouds || companion === "couple"
        ? "☁️ Pine Hill Cloud Hunting — Highland Sunrise"
        : "🌅 Village Sunrise Walk \u0026 Pi Lung Suspension Bridge",
      slug: "cau-treo-pi-lung-va-check-in",
      category: "Tham quan",
      image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
      duration: "1.5h",
      distanceFromPrev: "4km từ homestay",
      summary: likesClouds || companion === "couple"
        ? "Đồi Thông A Lưới nằm ngay trung tâm thị trấn — được ví như 'Đà Lạt thu nhỏ'. Biển mây bồng bềnh phủ trắng thung lũng lúc 06:15-07:15, ánh nắng đầu ngày xuyên qua từng hàng thông thẳng tắp. Khung cảnh đẹp nhất vào mùa se lạnh (tháng 10 - tháng 3)."
        : "Thức giấc cùng tiếng chim hót ven suối. Dạo bộ nhẹ nhàng qua Cầu Treo Pi Lung bắc qua sông Đakrông, ngắm sương sớm tan dần trên những nương rẫy của bà con Pa Cô.",
      enSummary: likesClouds || companion === "couple"
        ? "A Luoi Pine Hill — the 'mini Da Lat' of Hue highlands. Sea of clouds rolls over the valley between 06:15-07:15 AM, with golden rays piercing the pine canopy. Most dramatic in the cool season (Oct-Mar)."
        : "Wake to birdsong by the stream. Stroll across Pi Lung Suspension Bridge over the Dakrong River as morning mist lifts from Pa Co rice terraces.",
      wisdomTip: likesClouds || companion === "couple"
        ? "Mây đẹp nhất từ 06:15 - 07:15 — sau đó nắng lên và mây tan. Mang áo khoác vì nhiệt độ sáng sớm chỉ 16-18°C. Đồi Thông cách trung tâm thị trấn chỉ 1km, đi bộ được từ homestay gần đó."
        : "Dừng giữa cầu treo để chụp ảnh ngược sáng bình minh — khung cảnh rất điện ảnh và lãng mạn.",
      enWisdomTip: likesClouds || companion === "couple"
        ? "Prime cloud window is 06:15-07:15 before sunshine burns mist away. Bring a jacket — early mornings are 16-18°C. Pine Hill is just 1km from town center, walkable from nearby homestays."
        : "Stand at the bridge's midpoint for silhouette sunrise shots — incredibly cinematic.",
      energyLevel: "easy",
      googleMapsQuery: "Đồi Thông A Lưới Thừa Thiên Huế",
      stopType: "visit",
      mustTry: [
        "📸 Chụp ảnh biển mây từ 06:15 - 07:00 (cửa sổ vàng trước khi mây tan)",
        "🌲 Đi bộ giữa hàng thông trên đồi — không khí tinh khiết, thanh lọc phổi",
        "🤸 Tập khí công hoặc yoga buổi sáng giữa thiên nhiên (nhiều du khách làm vậy!)",
        "☕ Chuẩn bị túi cà phê pha sẵn để uống nóng ngay trên đồi nhìn ra thung lũng"
      ],
      enMustTry: [
        "📸 Photograph the cloud sea between 06:15-07:00 before sunshine dissolves it",
        "🌲 Walk between the pine rows — ultra-pure air and meditative calm",
        "🤸 Morning yoga or tai chi among the trees (many guests do this!)",
        "☕ Bring a thermos of pre-brewed coffee to sip while gazing at the valley"
      ]
    });

    // STOP 2.2: BỮA SÁNG CHÍNH THỨC (07:30 - 08:30) — Chợ A Lưới / Quán bản địa
    day2Stops.push({
      id: "bua-sang-cho-a-luoi-day2",
      timeSlot: "07:30 - 08:45",
      name: "🍚 Bữa Sáng Chính Tại Chợ A Lưới — Đặc Sản Vùng Cao Buổi Sớm",
      enName: "🍚 Authentic Highland Breakfast at A Luoi Market",
      slug: "quan-com-ban-pa-co",
      category: "Ăn uống",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
      duration: "1.25h",
      distanceFromPrev: "3km - trung tâm thị trấn",
      summary: "Chợ A Lưới sáng sớm là nơi tụ họp của bà con người Pa Cô, Cơ Tu, Tà Ôi. Từ 06:00 đến 08:00, các gian hàng bày đầy đặc sản tươi nguyên: bánh A Quát (sừng trâu) nóng hổi, cháo gà kiến, xôi nếp than tím, rau rừng tươi và cơm lam sáng. Đây là trải nghiệm ẩm thực xác thực nhất của vùng cao A Lưới, không có tour du lịch nào có thể tái hiện.",
      enSummary: "The early morning A Luoi market gathers Pa Co, Co Tu, and Ta Oi people. From 06:00-08:00, stalls overflow with fresh highland specialties: hot A Quat buffalo-horn rice cakes, ant-chicken porridge, purple sticky rice, and bamboo rice. The most authentic highland food experience money can't replicate.",
      wisdomTip: "Nên đến trước 07:30 để chọn bánh A Quát còn nóng — bán hết rất nhanh. Thanh toán bằng tiền mặt, mệnh giá nhỏ. Giá cực rẻ: bánh A Quát khoảng 5.000-10.000đ/cái.",
      enWisdomTip: "Arrive before 07:30 for hot A Quat cakes — they sell out quickly. Bring small cash bills. Prices are very affordable: A Quat cakes cost just 5,000-10,000 VND each.",
      energyLevel: "easy",
      googleMapsQuery: "Chợ A Lưới thị trấn A Lưới Thừa Thiên Huế",
      stopType: "breakfast",
      mustTry: [
        "🫓 Bánh A Quát (sừng trâu) — lá chuối gói nếp nương nhân đậu đen, nướng than nóng hổi",
        "🍗 Cháo gà kiến A Lưới — nấu loãng đặc biệt với lá é và tiêu rừng, ăn sáng ấm bụng",
        "🍚 Xôi nếp than tím — màu đẹp, dẻo thơm, ăn kèm dừa nạo hoặc mè đen",
        "🥣 Cơm lam sáng sớm — ống nứa nướng từ đêm hôm trước, hương vị đặc trưng",
        "🛒 Mua thêm mật ong rừng tươi từ người dân bán ven đường — không tem nhãn nhưng chính gốc"
      ],
      enMustTry: [
        "🫓 A Quat buffalo-horn cakes — banana leaf-wrapped glutinous rice with black bean filling",
        "🍗 Ant-chicken rice porridge — simmered with wild forest basil and mountain pepper",
        "🍚 Purple sticky rice (xôi nếp than) — vivid color, soft, served with grated coconut",
        "🥣 Early morning bamboo rice (cơm lam) — bamboo roasted overnight, uniquely fragrant",
        "🛒 Buy fresh wild honey from roadside villagers — no label, but authentically local"
      ]
    });

    // STOP 2.3: CÀ PHÊ SÁNG VÙNG CAO (08:45 - 09:30)
    day2Stops.push({
      id: "ca-phe-sang-day2",
      timeSlot: "08:45 - 09:30",
      name: "☕ Cà Phê Arabica A Lưới — Hương Vị Núi Rừng Trường Sơn",
      enName: "☕ A Luoi Arabica Coffee — Taste of the Truong Son Mountains",
      slug: "dac-san-thit-bo-gac-bep-va-ruou-can",
      category: "Cà phê",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
      duration: "0.75h",
      distanceFromPrev: "Trung tâm thị trấn",
      summary: "A Lưới là vùng trồng cà phê Arabica đặc sản của Thừa Thiên Huế (3.5 ha canh tác). Các quán cà phê trong thị trấn như Trần Coffee (204 Hồ Chí Minh), Đường Hầm Cafe (Abiah) hoặc Cafe Du Lịch phục vụ cà phê rang xay nguyên chất địa phương — đậm đà, ít chua, hương thơm cao nguyên. Không gian mộc mạc, view nhìn ra dãy núi Trường Sơn.",
      enSummary: "A Luoi grows premium Arabica on 3.5 hectares — rare for Thua Thien Hue province. Town coffee shops like Tran Coffee or Duong Ham Cafe serve freshly-roasted local beans — bold, low-acid, with a distinct highland aroma. Simple rustic setting with Truong Son mountain views.",
      wisdomTip: "Thử cà phê phin A Lưới — không đường không sữa để cảm nhận trọn vẹn hương thơm đặc trưng. Hoặc hỏi chủ quán về tour trải nghiệm nông trại cà phê nếu quan tâm.",
      enWisdomTip: "Try the local drip coffee (cà phê phin) black — no sugar or milk — to experience the full highland aroma. Ask the owner about coffee farm tours if you're interested.",
      energyLevel: "easy",
      googleMapsQuery: "Trần Coffee A Lưới Thừa Thiên Huế",
      stopType: "coffee",
      mustTry: [
        "☕ Cà phê phin đen A Lưới — uống chậm, không đường, cảm nhận hậu vị ngọt tự nhiên",
        "🥛 Bạc xỉu vùng cao — cà phê Arabica pha sữa đặc, hương thơm nhẹ nhàng",
        "🫐 Hỏi mua cà phê hạt rang tươi về nhà — quà tặng ý nghĩa, giá rất tốt",
        "🗺️ Hỏi chủ quán về đường đến các điểm tắm suối — họ biết rõ nhất!"
      ],
      enMustTry: [
        "☕ Black drip-filter A Luoi coffee — sip slowly and savor the naturally sweet aftertaste",
        "🥛 Local bac xiu (coffee with condensed milk) — gentle and aromatic",
        "🫐 Buy freshly-roasted whole beans to take home — meaningful souvenir at great value",
        "🗺️ Ask the owner for insider directions to the best swimming spots"
      ]
    });

    // STOP 2.2: GIỮA SÁNG (08:30 - 11:30)
    if (likesHotspring && !avoidsDeepCurves && !day1Stops.some(s => s.id.includes("khoang-nong"))) {
      // TẮM KHOÁNG NÓNG A ROÀNG NẾU NGÀY 1 CHƯA ĐI
      day2Stops.push({
        id: "suoi-khoang-nong-a-roang-day2",
        timeSlot: "08:45 - 11:45",
        name: "Suối Khoáng Nóng Thiên Nhiên A Roàng (Thư Giãn Gân Cốt)",
        enName: "A Roang Geothermal Springs Thermal Relaxation",
        slug: "rung-nguyen-sinh-a-roang",
        category: "Hoạt động ngoài trời",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
        duration: "3.0h",
        distanceFromPrev: "25km theo đường Hồ Chí Minh Tây",
        summary: "Mạch khoáng nóng 60-70°C tự nhiên giữa rừng già A Roàng. Ngâm mình trong bể khoáng ấm giúp kích thích tuần hoàn máu và phục hồi năng lượng tối đa.",
        enSummary: "Thermal mineral pool nestled in ancient rainforest; deeply relaxes muscles and boosts vitality.",
        wisdomTip: "Nên mang khăn tắm cá nhân và đồ thay; kết hợp ngâm chân khoáng nóng ngắm rừng đại ngàn nguyên sinh.",
        enWisdomTip: "Bring your personal towel; alternate thermal soak intervals with cool air rests.",
        energyLevel: "easy",
        googleMapsQuery: "Suối khoáng nóng A Roàng A Lưới"
      });
    } else if (likesZeng && !day1Stops.some(s => s.id.includes("zeng"))) {
      // DỆT ZÈNG TÀ ÔI
      day2Stops.push({
        id: "det-zeng-ta-oi-day2",
        timeSlot: "08:45 - 11:15",
        name: "Làng Nghề Dệt Zèng A Đớt: Học Xâu Cườm Cùng Nghệ Nhân",
        enName: "A Dot Zèng Weaving Village & Loom Workshop",
        slug: "trai-nghiem-det-zeng-ta-oi",
        category: "Văn hóa",
        image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
        duration: "2.5h",
        distanceFromPrev: "12km",
        summary: "Gặp gỡ các nghệ nhân dệt Zèng Tà Ôi, tự tay trải nghiệm dệt tấm vải cườm truyền thống và tìm hiểu những bộ trang phục lễ hội độc nhất vô nhị.",
        enSummary: "Hands-on bead-weaving workshop alongside indigenous master weavers in A Dot village.",
        wisdomTip: "Một chiếc ví hoặc vòng tay dệt Zèng là món quà mang ý nghĩa cầu may mắn và bình an cho chuyến đi.",
        enWisdomTip: "Hand-beaded Zèng bracelets make meaningful good-luck tokens for travelers.",
        energyLevel: "easy",
        googleMapsQuery: "Hợp tác xã dệt dèng A Lưới"
      });
    } else {
      // SUỐI A LIN HOẶC LÀNG SINH THÁI THƯ THÁI
      day2Stops.push({
        id: "suoi-a-lin-day2",
        timeSlot: "08:45 - 11:30",
        name: "Suối A Lin (Chòi Tre Nghỉ Mát & Chèo Thuyền Êm Dịu)",
        enName: "A Lin Serene Stream & Bamboo Pavilions",
        slug: "suoi-a-lin",
        category: "Thác và suối",
        image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
        duration: "2.75h",
        distanceFromPrev: "10km đường bằng phẳng",
        summary: "Cung đường đi êm dịu không uốn dốc. Suối A Lin có dòng chảy êm đềm, nước trong vắt đến tận đáy, chòi tre mát rượi để ngả lưng đọc sách hoặc bơi lội nhẹ nhàng.",
        enSummary: "Flat scenic route leading to crystal-clear shallow stream with airy bamboo huts and gentle waters.",
        wisdomTip: "Chòi nghỉ ven suối A Lin rất lộng gió và mát mẻ, đặc biệt thích hợp cho nhóm gia đình có trẻ nhỏ nghỉ ngơi.",
        enWisdomTip: "Riverside bamboo huts stay pleasantly cool, perfect for family groups with children.",
        energyLevel: "easy",
        googleMapsQuery: "Suối A Lin Hồng Trung A Lưới"
      });
    }

    // STOP 2.3: BỮA TRƯA & ĐẶC SẢN CHỢ PHIÊN
    day2Stops.push({
      id: "bua-trua-cho-phien-day2",
      timeSlot: "11:45 - 13:45",
      name: "Bữa Trưa Đặc Sản & Ghé Chợ Phiên Mua Quà OCOP",
      enName: "Local Lunch & Highland OCOP Gift Shopping",
      slug: "dac-san-thit-bo-gac-bep-va-ruou-can",
      category: "Đặc sản",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
      duration: "2.0h",
      distanceFromPrev: "6km",
      summary: "Thưởng thức bữa trưa ấm cúng. Ghé chợ phiên trung tâm chọn mua mật ong rừng nguyên chất có tem OCOP, thịt bò cỏ gác bếp sấy củi thơm lừng, chuối rừng sấy dẻo và tiêu rừng A Lưới mang về làm quà.",
      enSummary: "Savor lunch followed by a stroll through the highland market to purchase certified wild forest honey, wood-smoked beef, and mountain spices.",
      wisdomTip: "Nên hỏi mua mật ong của Hợp tác xã bản địa có mã vạch truy xuất để yên tâm về chất lượng chuẩn 100%.",
      enWisdomTip: "Look for certified cooperative labels with traceability QR codes for genuine wild forest honey.",
      energyLevel: "easy",
      googleMapsQuery: "Chợ A Lưới Thừa Thiên Huế",
      stopType: "meal"
    });

    // NẾU LÀ TOUR 2 NGÀY: STOP 2.4 LÀ CHẶNG VỀ HUẾ
    if (duration === "2-days") {
      day2Stops.push({
        id: "ve-hue-chieu-day2",
        timeSlot: "14:30 - 16:30",
        name: "Tạm Biệt A Lưới & Xuống Đèo QL49 Về Lại TP. Huế (70km)",
        enName: "Scenic Mountain Descent Along QL49 Back to Hue",
        slug: "dich-vu-xe-dua-don-hue-a-luoi",
        category: "Di chuyển",
        image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
        duration: travelDurationFromHue,
        distanceFromPrev: "70km đường đèo",
        travelTimeFromPrev: travelDurationFromHue,
        isTravelLeg: true,
        summary: `Khởi hành xuống đèo trước 15:00. Chuyến xe kéo dài khoảng ${travelDurationFromHue} đưa du khách trở về lại trung tâm TP. Huế an toàn, kết thúc trọn vẹn hành trình 2 ngày 1 đêm.`,
        enSummary: `Descend Highway 49 before late afternoon mist, arriving back in Hue city around 16:30 (${travelDurationFromHue} drive).`,
        wisdomTip: "Đoạn đèo xuống dốc cần giữ khoảng cách xe tối thiểu 30m, xe máy tuyệt đối không bóp phanh liên tục để tránh cháy má phanh.",
        enWisdomTip: "Keep safe vehicle distance on pass descent; motorcyclists should use engine braking rather than riding brakes.",
        energyLevel: "easy",
        googleMapsQuery: "Thành phố Huế",
        stopType: "checkout"
      });
    }

    days.push({
      dayNumber: 2,
      title:
        duration === "2-days"
          ? "Ngày 2: Hơi Ấm Suối Khoáng, Tinh Hoa Bản Làng & Trở Về Cố Đô"
          : "Ngày 2: Kỳ Thú Đại Ngàn, Suối Khoáng Nóng & Rừng Nguyên Sinh",
      enTitle: duration === "2-days" ? "Day 2: Mineral Warmth, Living Heritage & Return to Hue" : "Day 2: Rainforest Wonders & Geothermal Rejuvenation",
      theme:
        duration === "2-days"
          ? "Săn mây bình minh • Ngâm khoáng nóng / Dệt Zèng • Mua quà OCOP & Xuống đèo QL49 về Huế"
          : "Khám phá chiều sâu Trường Sơn • Tắm khoáng lộ thiên • Rừng nguyên sinh",
      enTheme: "Sunrise mists • Thermal spa / Zèng artisanry • Mountain descent to Hue",
      stops: day2Stops
    });
  }

  // =========================================================================
  // NGÀY 3: KHÁM PHÁ CHIỀU SÂU LỊCH SỬ & HOANG SƠ (Nếu 3 Ngày)
  // =========================================================================
  if (duration === "3-days") {
    const day3Stops: ItineraryStop[] = [];

    // STOP 3.1: CHINH PHỤC ĐỒI A BIA HOẶC RỪNG NGUYÊN SINH
    if (likesHistory && !avoidsHiking) {
      day3Stops.push({
        id: "chinh-phuc-doi-a-bia-day3",
        timeSlot: "08:00 - 11:30",
        name: "Chinh Phục Đỉnh Đồi A Bia (Hamburger Hill 937 Huyền Thoại)",
        enName: "Trek to Historic Hill 937 (Hamburger Hill Peak)",
        slug: "doi-a-bia",
        category: "Tham quan",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
        duration: "3.5h",
        distanceFromPrev: "15km từ trung tâm",
        summary: "Leo qua các bậc thang đá giữa tán rừng nguyên sinh rợp bóng lên đỉnh đồi A Bia cao 937m. Lắng nghe người dẫn đường bản địa thuyết minh câu chuyện chiến đấu kiên cường và chiêm ngưỡng toàn cảnh thung lũng A Shau bao la.",
        enSummary: "Trek through lush mountain trails to the 937m historic peak, surveying panoramic views of legendary A Shau valley.",
        wisdomTip: "Nên mang giày thể thao có độ bám cao, mang theo 1 chai nước suối cá nhân và thuốc xịt côn trùng.",
        enWisdomTip: "Wear sturdy hiking boots; carry at least 1L hydration bottle and insect repellent spray.",
        energyLevel: "challenging",
        googleMapsQuery: "Di tích Đồi A Bia A Lưới"
      });
    } else {
      day3Stops.push({
        id: "kham-pha-rung-a-roang-day3",
        timeSlot: "08:15 - 11:15",
        name: "Khám Phá Rừng Nguyên Sinh Trường Sơn & Thác Khe Me",
        enName: "Truong Son Rainforest Discovery & Khe Me Cascade",
        slug: "rung-nguyen-sinh-a-roang",
        category: "Hoạt động ngoài trời",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
        duration: "3.0h",
        distanceFromPrev: "20km",
        summary: "Dạo bước dưới tán cây cổ thụ hàng trăm năm tuổi, ngắm nhìn thảm thực vật phong lan rừng nhiệt đới và hít thở bầu không khí tinh khiết tuyệt đối của rừng già biên giới.",
        enSummary: "Walk under ancient hardwood canopies, spot wild tropical orchids, and breathe pristine border forest air.",
        wisdomTip: "Đi theo lối mòn có hướng dẫn viên bản địa, không tự ý hái nấm lạ trong rừng.",
        enWisdomTip: "Stay on marked trails with local guides; never pick unknown wild mushrooms.",
        energyLevel: "moderate",
        googleMapsQuery: "Rừng nguyên sinh A Roàng A Lưới"
      });
    }

    // STOP 3.2: BỮA TRƯA TỔNG KẾT
    day3Stops.push({
      id: "bua-trua-tong-ket-day3",
      timeSlot: "11:45 - 13:45",
      name: "Bữa Trưa Tổng Kết: Mâm Cơm Khép Lại Hành Trình Bản Địa",
      enName: "Farewell Highland Lunch Feast",
      slug: "quan-com-ban-pa-co",
      category: "Ăn uống",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
      duration: "2.0h",
      distanceFromPrev: "8km",
      summary: "Thưởng thức mâm cơm đầm ấm với các món đặc sản tinh túy nhất của A Lưới. Giao lưu chia tay cùng bà con và hướng dẫn viên bản địa.",
      enSummary: "Heartwarming farewell banquet with iconic highland dishes, sharing memories with local hosts.",
      wisdomTip: "Có thể đặt trước các hũ mật ong rừng hoặc bánh A Quát gói mới mang về làm quà cho gia đình.",
      enWisdomTip: "Pre-order freshly packed A Quat cakes or wild honey jars for taking home to loved ones.",
      energyLevel: "easy",
      googleMapsQuery: "Quán cơm bản Pa Cô A Lưới"
    });

    // STOP 3.3: CHẶNG DI CHUYỂN VỀ HUẾ
    day3Stops.push({
      id: "ve-hue-chieu-day3",
      timeSlot: "14:30 - 16:45",
      name: "Khởi Hành Trở Về TP. Huế Qua Cung Đèo QL49 (70km)",
      enName: "Final Scenic Mountain Descent Back to Hue (70km)",
      slug: "dich-vu-xe-dua-don-hue-a-luoi",
      category: "Di chuyển",
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
      duration: travelDurationFromHue,
      distanceFromPrev: "70km đường đèo QL49",
      travelTimeFromPrev: travelDurationFromHue,
      isTravelLeg: true,
      summary: `Xuống đèo sớm trước 15:00. Thời gian di chuyển khoảng ${travelDurationFromHue}. Du khách về đến trung tâm Cố Đô Huế an toàn trước 17:00, kết thúc trọn vẹn chuyến phiêu lưu 3 ngày 2 đêm tại xứ cao nguyên.`,
      enSummary: `Clear the mountain pass before late twilight, arriving safely in central Hue by 17:00 (${travelDurationFromHue} trip).`,
      wisdomTip: "Dừng chân nghỉ ngơi 10 phút tại chân đèo Hồng Hạ để uống nước chè xanh trước khi hòa vào dòng xe cộ thành phố.",
      enWisdomTip: "Take a 10-minute hydration pause at the foot of Hong Ha pass before merging into city traffic.",
      energyLevel: "easy",
      googleMapsQuery: "Thành phố Huế"
    });

    days.push({
      dayNumber: 3,
      title: "Ngày 3: Dấu Tích Trường Sơn Oai Hùng & Chặng Đường Về Cố Đô",
      enTitle: "Day 3: Heroic Truong Son Landmarks & Return Journey to Hue",
      theme: "Ký ức lịch sử • Rừng già ngàn năm • Xuống đèo QL49 về Huế an toàn",
      enTheme: "Living history • Ancient woods • Safe mountain return to Hue",
      stops: day3Stops
    });
  }

  // Tính tổng quãng đường
  const totalDistanceKm = duration === "1-day" ? 145 : duration === "2-days" ? 195 : 260;

  // Tiêu đề cá nhân hóa theo đúng sở thích
  let dynamicTitle = "Hành Trình Khám Phá Đại Ngàn A Lưới";
  let dynamicEnTitle = "Bespoke A Luoi Highland Journey";

  if (likesHotspring) {
    dynamicTitle = `Liệu Trình Suối Khoáng Nóng A Roàng & Thư Giãn Rừng Già (${duration === "1-day" ? "1 Ngày" : duration === "2-days" ? "2N1Đ" : "3N2Đ"})`;
    dynamicEnTitle = `A Roang Geothermal Wellness & Rainforest Retreat (${duration})`;
  } else if (likesClouds) {
    dynamicTitle = `Hành Trình Săn Mây Đồi Thông & Tiếng Thác A Lưới (${duration === "1-day" ? "1 Ngày" : duration === "2-days" ? "2N1Đ" : "3N2Đ"})`;
    dynamicEnTitle = `Pine Hill Cloud Hunting & Cascade Odyssey (${duration})`;
  } else if (likesZeng) {
    dynamicTitle = `Hành Trình Sổ Tay Thổ Cẩm Zèng & Văn Hóa Bản Địa (${duration === "1-day" ? "1 Ngày" : duration === "2-days" ? "2N1Đ" : "3N2Đ"})`;
    dynamicEnTitle = `Zèng Cultural Threads & Indigenous Heritage (${duration})`;
  } else if (likesHistory) {
    dynamicTitle = `Chinh Phục Đồi A Bia & Ký Ức Hào Hùng Trường Sơn (${duration === "1-day" ? "1 Ngày" : duration === "2-days" ? "2N1Đ" : "3N2Đ"})`;
    dynamicEnTitle = `Conquering Hamburger Hill & Truong Son Trail Footprints (${duration})`;
  } else if (companion === "family") {
    dynamicTitle = `Tour Nghỉ Dưỡng Sinh Thái Gia Đình: Suối Mát & Homestay Bản Địa (${duration === "1-day" ? "1 Ngày" : duration === "2-days" ? "2N1Đ" : "3N2Đ"})`;
    dynamicEnTitle = `Family Gentle Eco-Haven: Pristine Streams & Warm Homestays (${duration})`;
  } else if (companion === "friends") {
    dynamicTitle = `Tour Khám Phá Thác 3 Tầng, Lửa Trại & Phượt Đèo QL49 (${duration === "1-day" ? "1 Ngày" : duration === "2-days" ? "2N1Đ" : "3N2Đ"})`;
    dynamicEnTitle = `Active Adventure: Waterfalls, Campfire & Mountain Pass Ride (${duration})`;
  }

  // Xây dựng Báo cáo Khí hậu & Cố vấn Thời tiết Mùa A Lưới
  const seasonName = isWetSeason
    ? "Mùa Mưa & Sương Mù Đèo Trường Sơn (Tháng 9–11)"
    : isColdMistSeason
    ? "Mùa Đông Cao Nguyên & Biển Mây Bồng Bềnh (Tháng 12–2)"
    : "Mùa Khô Nắng Ấm & Suối Ngọc Bích (Tháng 3–8)";

  const enSeasonName = isWetSeason
    ? "Truong Son Mist & Highland Rain Season (Sep–Nov)"
    : isColdMistSeason
    ? "Highland Winter & Sea-of-Clouds Season (Dec–Feb)"
    : "Golden Sunshine & Crystal Streams Season (Mar–Aug)";

  const conditionSummary = isRainy
    ? "Khí hậu vùng cao hiện tại có độ ẩm cao, có mưa rào hoặc sương mù dày trên đèo QL49."
    : isColdMistSeason
    ? "Trời se lạnh, ban đêm 16-18°C, sương sớm bao phủ thung lũng tạo biển mây tuyệt đẹp."
    : "Tiết trời khô ráo, nắng ấm 24-28°C, dòng suối trong vắt và mát lạnh lý tưởng.";

  const enConditionSummary = isRainy
    ? "High moisture conditions with drizzle or dense pass mist along Highway 49."
    : isColdMistSeason
    ? "Crisp 16-18°C temperatures with early valley fog forming stunning cloud formations."
    : "Pleasant sunny weather (24-28°C), crystal clear rivers ideal for swimming.";

  const rainRisk = isRainy ? "high" : (weatherForecast && weatherForecast.rainChance > 40 ? "medium" : "low");
  const cloudHuntingRating = (isColdMistSeason || isWetSeason) ? "excellent" : "fair";

  const aiAlerts: string[] = [
    transport === "motorbike"
      ? "🏍️ Cảnh báo đèo QL49: Đỉnh đèo Mỏ Quạ và A Co sương mù dày nhất vào lúc 06:00-07:30 và sau 16:30. Bật đèn cốt, giữ khoảng cách 30m."
      : "🚗 Cảnh báo ô tô: Đoạn cua đèo A Co dốc quanh co, lưu ý nhường đường xe tải chở nông sản đi ngược chiều.",
    isRainy
      ? "⚠️ Nước suối có thể chảy xiết hơn ngày thường: Tuyệt đối không tắm ở vùng xoáy sâu hoặc trèo lên vách đá ướt."
      : "☀️ Khung giờ tắm suối đẹp nhất: 11:30 - 15:00 khi ánh nắng rọi xuyên qua tán rừng già làm nước ấm dịu.",
    "🌙 Biên độ nhiệt cao: Đêm và rạng sáng ở A Lưới luôn giảm từ 6-8°C so với TP. Huế — mang áo ấm khi ngủ nhà sàn."
  ];

  const enAiAlerts: string[] = [
    transport === "motorbike"
      ? "🏍️ Pass Alert: Dense fog gathers at Mo Qua and A Co passes before 07:30 and after 16:30. Use fog lamps and keep 30m distance."
      : "🚗 Driving Alert: Sharp hairpin curves along Pass 49 — yield to climbing mountain trucks.",
    isRainy
      ? "⚠️ High river volume: Avoid deep water currents and stay clear of mossy, slick boulders."
      : "☀️ Optimal waterfall swimming window: 11:30 - 15:00 when sunlight warms the stream pools.",
    "🌙 Temperature Swing: A Luoi nights drop 6-8°C below Hue lowland — pack a warm fleece for stilt-house stays."
  ];

  const adaptiveActions: string[] = isRainy
    ? [
        "Đã tự động ưu tiên Suối khoáng nóng A Roàng (ngâm nước nóng 60°C có mái che, chống rét hoàn hảo).",
        "Tăng thời lượng trải nghiệm Làng Nghề Dệt Zèng & Giao lưu văn hóa trong nhà sàn Pa Cô ấm cúng.",
        "Điều chỉnh thời gian vượt đèo xuống núi sớm trước 15:30 để đảm bảo tầm nhìn sáng rõ an toàn."
      ]
    : [
        "Tối ưu cung đường đón nắng sớm tại đồi thông và suối nước mát vào giữa trưa.",
        "Khung giờ vượt đèo được canh chỉnh để du khách dừng chân chụp ảnh mây vắt ngang thung lũng sông Hương.",
        "Đêm lửa trại ngoài trời được xác nhận thuận lợi cho hoạt động giao lưu cồng chiêng."
      ];

  const enAdaptiveActions: string[] = isRainy
    ? [
        "Prioritized A Roang natural hot springs (covered warm mineral soaking, ideal for misty days).",
        "Extended indoor cultural time with master Ta Oi Zeng weavers inside dry stilt houses.",
        "Shifted return pass departure earlier before 15:30 for clear daylight visibility."
      ]
    : [
        "Optimized schedule for morning sunbeams at pine hills and midday swim in pristine creeks.",
        "Pass-crossing timed for dramatic photos of clouds rolling over the Huong River gorge.",
        "Outdoor campfire and sacred gong ceremonies are set for optimal evening conditions."
      ];

  const weatherAdvisory: WeatherAdvisory = {
    seasonName,
    enSeasonName,
    conditionSummary,
    enConditionSummary,
    tempRange: weatherForecast ? `${weatherForecast.tempMin}°C - ${weatherForecast.tempMax}°C` : (isColdMistSeason ? "16°C - 23°C" : "19°C - 28°C"),
    rainRisk,
    cloudHuntingRating,
    aiAlerts,
    enAiAlerts,
    adaptiveActions,
    enAdaptiveActions
  };

  return {
    id: `al-plan-${Date.now().toString(36)}`,
    title: dynamicTitle,
    enTitle: dynamicEnTitle,
    duration,
    transport,
    companion,
    departureTime,
    weatherAdvisory,
    totalDistanceKm,
    energyRating,
    estBudgetPerPerson: estBudget,
    days,
    likes,
    dislikes,
    safetyTips: [
      `Thời gian di chuyển từ trung tâm TP. Huế lên A Lưới mất khoảng ${travelDurationFromHue} (70km đường đèo QL49). Hãy xuất phát sớm để có trọn vẹn thời gian trải nghiệm.`,
      "Đoạn đèo A Co có nhiều khúc cua uốn lượn. Xe máy tuyệt đối không tắt máy thả trôi, luôn về số thấp 2-3 để hãm tốc độ bằng động cơ.",
      "Sau 16:30 chiều sương mù đèo hạ thấp rất nhanh làm giảm tầm nhìn. Nguyên tắc vàng của người bản địa là xuất phát xuống đèo trước 16:30.",
      "Vùng núi sóng 4G một số đoạn hẻm núi có thể chập chờn. Hãy chụp màn hình hoặc lưu lịch trình offline này về máy.",
      "Nhiệt độ ban đêm trên cao nguyên A Lưới hạ xuống 17-19°C (se lạnh), luôn mang theo một chiếc áo khoác gió nhẹ."
    ],
    enSafetyTips: [
      `Travel time from central Hue City along Highway 49 takes about ${travelDurationFromHue} (70km). Early morning departures are strongly recommended.`,
      "Route 49 (A Co Pass) features steep switchbacks. Never coast in neutral; engine-brake in 2nd or 3rd gear.",
      "Thick mountain mist descends rapidly after 16:30. Aim to clear the pass before sunset.",
      "Mobile cellular signals may fluctuate in deep gorges. Screenshot or cache this page offline.",
      "Highland nights are crisp (17-19°C). Pack a light windbreaker or fleece layer."
    ],
    culturalRules: [
      "Khi vào nhà Rông / nhà Moong hoặc bản làng, hãy chào hỏi người lớn tuổi hoặc đi cùng hướng dẫn viên người bản địa.",
      "Không tự ý gõ chiêng cồng hoặc chạm tay vào vật thiêng treo trên cột cái nhà sàn.",
      "Uống rượu Đoác bằng hai tay khi được gia chủ người Pa Cô, Tà Ôi mời để bày tỏ lòng quý trọng hiếu khách.",
      "Trang phục tắm suối kín đáo, lịch sự, tôn trọng không gian sinh hoạt của bà con đồng bào."
    ],
    enCulturalRules: [
      "Always greet village elders or accompany a local guide when visiting sacred communal Rong houses.",
      "Do not touch ceremonial gongs or sacred artifacts hanging on the central pillar without permission.",
      "Receive drinks or gifts with both hands as a traditional gesture of gratitude and mutual respect.",
      "Opt for modest swimwear when taking dips around local waterfalls to respect community customs."
    ],
    packingList: [
      "Giày thể thao có đế bám tốt chống trơn trượt khi lội đá suối thác.",
      "Đồ bơi, khăn tắm cá nhân và túi chống nước bảo vệ điện thoại.",
      "Áo khoác mỏng chống sương đêm, thuốc xịt muỗi / côn trùng rừng.",
      "Một ít tiền mặt (các bản làng chưa hỗ trợ quẹt thẻ tín dụng)."
    ],
    enPackingList: [
      "Grippy walking shoes or water sandals suitable for damp river stones.",
      "Swimwear, quick-dry travel towel, and a waterproof phone pouch.",
      "Light windbreaker for evening mist and insect repellent spray.",
      "Modest cash in VND as mountain homestays might not take foreign credit cards."
    ]
  };
}
