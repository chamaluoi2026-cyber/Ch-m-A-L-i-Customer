import { places, Place } from "@/data/places";

export type TripDuration = "1-day" | "2-days" | "3-days";
export type TransportType = "motorbike" | "car";
export type TravelCompanion = "solo" | "couple" | "family" | "friends";

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
    description: "Thác A Nôr 3 tầng, suối Pâr Le hoang sơ",
    enDescription: "3-tier A Nor falls, pristine Par Le stream",
    tags: ["thac", "suoi", "waterfall", "boi-loi"]
  },
  {
    id: "hotspring",
    icon: "♨️",
    label: "Suối khoáng nóng A Roàng",
    enLabel: "Geothermal Hot Springs",
    description: "Nước nóng 60°C lộ thiên phục hồi cơ thể",
    enDescription: "Natural 60°C spring water to rejuvenate",
    tags: ["khoang-nong", "a-roang", "hot-spring"]
  },
  {
    id: "zeng",
    icon: "🧵",
    label: "Thổ cẩm Dèng Tà Ôi (Di sản)",
    enLabel: "Sacred Zèng Weaving",
    description: "Nghệ thuật đính cườm thủ công di sản quốc gia",
    enDescription: "National intangible heritage beadwork",
    tags: ["van-hoa", "lang-nghe", "zeng"]
  },
  {
    id: "clouds",
    icon: "☁️",
    label: "Săn mây Đồi Thông & cắm trại",
    enLabel: "Cloud Hunting & Pine Hill",
    description: "Cảnh quan se lạnh, lãng mạn như Đà Lạt",
    enDescription: "Misty highlands and romantic pine groves",
    tags: ["doi-thong", "san-may", "checkin"]
  },
  {
    id: "campfire",
    icon: "🔥",
    label: "Lửa trại & cồng chiêng đêm",
    enLabel: "Campfire & Sacred Gongs",
    description: "Giao lưu bên bếp lửa nhà sàn người Pa Cô",
    enDescription: "Fireside music and cultural bonding",
    tags: ["lua-trai", "cong-chieng", "am-nhac"]
  },
  {
    id: "cuisine",
    icon: "🍗",
    label: "Ẩm thực cơm lam, gà nướng",
    enLabel: "Authentic Highland Feast",
    description: "Bánh A Quát, cá suối, gia vị tiêu rừng",
    enDescription: "Bamboo rice, roast hill chicken, wild spices",
    tags: ["an-uong", "am-thuc", "banh-a-quat"]
  },
  {
    id: "history",
    icon: "🎖️",
    label: "Chiến trường xưa (Đồi A Bia)",
    enLabel: "Hamburger Hill Battlefield",
    description: "Di tích lịch sử kháng chiến oai hùng",
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
    description: "Hạn chế đi sâu vào A Roàng, tập trung trung tâm",
    enDescription: "Stay around main valley, limit long winding roads",
    tags: ["deo-sau", "a-roang-xa"]
  },
  {
    id: "avoid-alcohol",
    icon: "🚫",
    label: "Kiêng rượu bia / không ăn cay",
    enLabel: "No alcohol / non-spicy meals",
    description: "Bỏ rượu Đoác/cần, chọn mâm cơm thanh đạm",
    enDescription: "Skip local wine, serve mild & wholesome food",
    tags: ["ruou", "cay-nong"]
  },
  {
    id: "avoid-crowds",
    icon: "🧘",
    label: "Tránh ồn ào đông đúc",
    enLabel: "Avoid crowded / loud spots",
    description: "Ưu tiên không gian yên tĩnh, hòa mình cùng thiên nhiên",
    enDescription: "Seek peaceful, secluded natural hideaways",
    tags: ["on-ao", "dong-duc"]
  },
  {
    id: "avoid-insects",
    icon: "🦟",
    label: "Dị ứng côn trùng / sợ vắt rừng",
    enLabel: "Fear of forest insects / leeches",
    description: "Không cắm trại rừng mùa mưa, ở phòng homestay kín",
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
  summary: string;
  enSummary: string;
  wisdomTip: string;
  enWisdomTip: string;
  energyLevel: "easy" | "moderate" | "challenging";
  googleMapsQuery: string;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  enTitle: string;
  theme: string;
  enTheme: string;
  stops: ItineraryStop[];
}

export interface ItineraryPlan {
  id: string;
  title: string;
  enTitle: string;
  duration: TripDuration;
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

export function generateHighlandItinerary(params: {
  duration: TripDuration;
  transport: TransportType;
  companion: TravelCompanion;
  likes: string[];
  dislikes: string[];
}): ItineraryPlan {
  const { duration, transport, companion, likes, dislikes } = params;

  const avoidsHiking = dislikes.includes("avoid-hiking");
  const avoidsDeepCurves = dislikes.includes("avoid-curves");
  const avoidsAlcohol = dislikes.includes("avoid-alcohol");
  const avoidsInsects = dislikes.includes("avoid-insects");

  const likesHotspring = likes.includes("hotspring");
  const likesZeng = likes.includes("zeng");
  const likesHistory = likes.includes("history");
  const likesClouds = likes.includes("clouds");
  const likesCampfire = likes.includes("campfire");

  // Determine overall energy rating
  let energyRating: "easy" | "moderate" | "challenging" = "moderate";
  if (avoidsHiking && (companion === "family" || companion === "couple")) {
    energyRating = "easy";
  } else if (!avoidsHiking && (likesHistory || duration === "3-days")) {
    energyRating = "challenging";
  }

  // Calculate base budget
  let estBudget = 650000;
  if (duration === "2-days") estBudget = 1450000;
  if (duration === "3-days") estBudget = 2350000;
  if (transport === "car") estBudget += 400000;

  const days: ItineraryDay[] = [];

  // ================= DAY 1 =================
  const day1Stops: ItineraryStop[] = [];

  // Stop 1: Hồng Hạ gateway
  day1Stops.push({
    id: "par-le",
    timeSlot: "08:30 - 11:30",
    name: "Suối Pâr Le (Xã Hồng Hạ)",
    enName: "Pâr Le Natural Stream (Hong Ha)",
    slug: "suoi-par-le",
    category: "Thác và suối",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    duration: "3.0h",
    distanceFromPrev: "45km từ TP. Huế",
    summary: "Cửa ngõ chân đèo A Co với vụng bơi ngọc bích phẳng lặng, cây rừng che bóng mát rượi.",
    enSummary: "Gateway at the foot of A Co Pass, boasting emerald swimming pools sheltered by virgin woods.",
    wisdomTip: "Nên tắm ở bãi số 1 với gia đình vì đáy bằng phẳng; bãi trên dành cho bạn trẻ thích lặn vách đá.",
    enWisdomTip: "Stick to pool #1 if with family for gentle shallow sands; upper falls are ideal for cliff dips.",
    energyLevel: "easy",
    googleMapsQuery: "Suối Pâr Le A Lưới Thừa Thiên Huế"
  });

  // Stop 2: Lunch
  day1Stops.push({
    id: "quan-com-pa-co",
    timeSlot: "12:00 - 13:30",
    name: "Bữa Trưa Pa Cô: Cơm Lam & Gà Nướng Núi",
    enName: "Pa Cô Feast: Bamboo Rice & Roast Hill Chicken",
    slug: "quan-com-ban-pa-co",
    category: "Ăn uống",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
    duration: "1.5h",
    distanceFromPrev: "12km vượt đèo A Co",
    summary: avoidsAlcohol
      ? "Thưởng thức gà đồi nướng mộc chấm muối hạt tiêu rừng thơm nồng, cơm nếp lam ống tre dẻo ngọt cùng trà dây rừng."
      : "Mâm cơm truyền thống với gà nướng than hoa, cá suối chiên giòn, xôi nếp than và 1 chén rượu Đoác sủi bọt thanh mát.",
    enSummary: avoidsAlcohol
      ? "Savor charred hill chicken with fragrant wild mountain pepper salt, bamboo sticky rice and forest herbal tea."
      : "Authentic highland tray with roasted chicken, river fish, purple sticky rice and a refreshing sip of natural Doac nectar.",
    wisdomTip: "Thịt gà bản A Lưới săn chắc ngọt thịt tự nhiên, ăn kèm lá é rừng tạo hương vị khó quên.",
    enWisdomTip: "A Luoi local chicken is lean and naturally flavorful; pair it with wild basil leaves for optimal taste.",
    energyLevel: "easy",
    googleMapsQuery: "Quán cơm bản Pa Cô A Lưới"
  });

  // Stop 3: Thác A Nôr or Cultural Village
  day1Stops.push({
    id: "thac-a-nor",
    timeSlot: "14:00 - 17:00",
    name: "Làng Du Lịch Sinh Thái & Thác A Nôr",
    enName: "A Nor 3-Tier Waterfall & Eco-Village",
    slug: "thac-a-nor",
    category: "Thác và suối",
    image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80",
    duration: "3.0h",
    distanceFromPrev: "8km",
    summary: avoidsHiking
      ? "Dạo bước ven chân thác tầng 1 bằng lối đi lát đá êm ái, ngâm chân thư giãn với nước lá thuốc thảo mộc Pa Cô."
      : "Chinh phục 3 tầng thác A Nôr bọt nước tung trắng xóa giữa rừng đại ngàn, bơi thuyền phao và tắm suối mát lạnh.",
    enSummary: avoidsHiking
      ? "Gentle stroll along tier 1 stone pathways, followed by a soothing herbal foot soak infused with Pa Co leaves."
      : "Explore all 3 cascades enveloped in deep jungle mist, swim in pristine natural basins, and enjoy rubber dinghies.",
    wisdomTip: "Độ lạnh nước thác khoảng 19-21°C. Hãy khởi động kỹ trước khi xuống tắm để tránh sốc nhiệt.",
    enWisdomTip: "Water temperature stays at 19-21°C. Warm up gently before plunging in to avoid temperature shock.",
    energyLevel: avoidsHiking ? "easy" : "moderate",
    googleMapsQuery: "Thác A Nôr Hồng Kim A Lưới"
  });

  // Stop 4: Evening Campfire or Peaceful Homestay
  if (duration !== "1-day") {
    day1Stops.push({
      id: "lua-trai-a-nor",
      timeSlot: "18:30 - 21:00",
      name: likesCampfire
        ? "Đêm Hội Cồng Chiêng & Lửa Trại Nhà Sàn"
        : "Nghỉ Dưỡng Nhà Sàn Ven Suối A Nôr",
      enName: likesCampfire
        ? "Sacred Gongs & Campfire Night Under The Stars"
        : "Peaceful Creek-Side Stilt House Haven",
      slug: "lua-trai-va-van-nghe-dia-phuong",
      category: "Lửa trại",
      image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80",
      duration: "2.5h",
      distanceFromPrev: "500m",
      summary: likesCampfire
        ? "Quây quần bên ánh lửa bập bùng, nghe già làng thổi khèn bè, cùng nhảy điệu Ra Zooc truyền thống gắn kết."
        : "Tận hưởng không gian tĩnh lặng nghe suối reo róc rách, sương đêm buông lạnh bảng lảng bên mái nhà sàn gỗ thơm.",
      enSummary: likesCampfire
        ? "Gather around the crackling fire, listen to tribal bamboo flutes, and join the rhythmic Ra Zooc solidarity dance."
        : "Embrace serene tranquility with bubbling creek sounds, cool mist, and the warm aroma of timber stilt houses.",
      wisdomTip: "Đêm ở A Lưới nhiệt độ hạ xuống 18°C, nhớ khoác thêm áo len mỏng khi ngồi sinh hoạt ngoài trời.",
      enWisdomTip: "Highland nights drop to 18°C. A light cardigan or fleece jacket is highly recommended.",
      energyLevel: "easy",
      googleMapsQuery: "Homestay A Nôr A Lưới"
    });
  }

  days.push({
    dayNumber: 1,
    title: "Ngày 1: Vượt Cung Đèo Mây & Tiếng Thác Rừng Già",
    enTitle: "Day 1: Conquering Mist Passes & Ancient Waterfalls",
    theme: "Chạm cửa ngõ Trường Sơn & Hòa mình vào thiên nhiên",
    enTheme: "Approaching Truong Son Gateway & Natural Immersion",
    stops: day1Stops
  });

  // ================= DAY 2 (If >= 2 days) =================
  if (duration !== "1-day") {
    const day2Stops: ItineraryStop[] = [];

    // Morning: Pine Hill or Zèng Weaving
    day2Stops.push({
      id: "doi-thong",
      timeSlot: "06:30 - 08:30",
      name: "Săn Mây Đồi Thông A Lưới & Cà Phê Ban Mai",
      enName: "Sunrise Cloud Hunting at Pine Hill",
      slug: "cau-treo-pi-lung-va-check-in",
      category: "Tham quan",
      image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
      duration: "2.0h",
      distanceFromPrev: "5km",
      summary: "Đón những tia nắng sớm xuyên qua rặng thông xanh ngắt, ngắm nhìn biển mây bồng bềnh phủ khắp thung lũng.",
      enSummary: "Catch morning sunbeams piercing through pine canopies while sea-of-clouds carpets the entire valley.",
      wisdomTip: "Khoảnh khắc mây đẹp nhất là từ 06:15 đến 07:15 sáng trước khi nắng rọi tan sương.",
      enWisdomTip: "Prime cloud formations occur between 06:15 and 07:15 AM before direct sunlight clears the mist.",
      energyLevel: "easy",
      googleMapsQuery: "Đồi Thông A Lưới Thừa Thiên Huế"
    });

    // Mid-morning: Zèng weaving
    day2Stops.push({
      id: "det-zeng",
      timeSlot: "09:00 - 11:00",
      name: "Không Gian Dệt Dèng Thổ Cẩm Tà Ôi (Di Sản Quốc Gia)",
      enName: "Zèng Beadwork Weaving Workshop (National Heritage)",
      slug: "trai-nghiem-det-zeng-ta-oi",
      category: "Văn hóa",
      image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
      duration: "2.0h",
      distanceFromPrev: "4km",
      summary: "Tận mắt chứng kiến các mế Tà Ôi xâu từng hạt cườm vào sợi dệt thủ công; tự tay dệt chiếc vòng tay kỷ niệm.",
      enSummary: "Watch master weavers embroider tiny glass beads directly onto looms; weave your own souvenir wristband.",
      wisdomTip: "Mua một tấm khăn Dèng trực tiếp tại hợp tác xã là sự hỗ trợ thiết thực nhất cho phụ nữ bản địa.",
      enWisdomTip: "Purchasing authentic Zèng scarves from the local co-op directly empowers indigenous women weavers.",
      energyLevel: "easy",
      googleMapsQuery: "Hợp tác xã dệt dèng A Lưới"
    });

    // Afternoon: A Roàng Hot Springs (if not avoiding curves) or Suối A Lin
    if (!avoidsDeepCurves && (likesHotspring || duration === "2-days")) {
      day2Stops.push({
        id: "khoang-nong-a-roang",
        timeSlot: "11:45 - 14:30",
        name: "Suối Khoáng Nóng Thiên Nhiên A Roàng & Ăn Trưa",
        enName: "A Roang Geothermal Springs & Riverside Lunch",
        slug: "rung-nguyen-sinh-a-roang",
        category: "Hoạt động ngoài trời",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
        duration: "2.5h",
        distanceFromPrev: "25km theo đường Hồ Chí Minh",
        summary: "Mạch nước khoáng nóng 60-70°C tự nhiên tuôn trào bên bờ suối đá, giúp giãn nở gân cốt, xua tan mỏi mệt sau chuyến đi.",
        enSummary: "60-70°C natural hot mineral springs bubbling alongside pristine riverbeds to soothe fatigued muscles.",
        wisdomTip: "Nên mang khăn tắm riêng và ngâm chân từng đợt 15 phút xen kẽ nước mát để tuần hoàn máu tốt nhất.",
        enWisdomTip: "Bring your personal towel; alternate 15-minute thermal soaks with cool dips for optimal circulation.",
        energyLevel: "easy",
        googleMapsQuery: "Suối khoáng nóng A Roàng A Lưới"
      });
    } else {
      day2Stops.push({
        id: "suoi-a-lin",
        timeSlot: "11:45 - 14:30",
        name: "Suối A Lin & Chòi Nghỉ Ven Rừng Hồng Trung",
        enName: "A Lin Serene Stream & Forest Pavilion",
        slug: "suoi-a-lin",
        category: "Thác và suối",
        image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
        duration: "2.5h",
        distanceFromPrev: "10km đường bằng",
        summary: "Cung đường êm dịu không uốn dốc, suối nông trong vắt bơi thuyền kayak nhẹ nhàng và ăn trưa trên chòi tre.",
        enSummary: "Flat scenic route without steep hairpins; shallow turquoise waters perfect for gentle paddling and pavilion lunch.",
        wisdomTip: "Chòi nghỉ ven suối A Lin rất mát mẻ, có thể nằm ngả lưng chợp mắt nghe tiếng nước chảy êm dịu.",
        enWisdomTip: "Bamboo pavilions stay delightfully cool; a peaceful spot for a post-lunch riverbank nap.",
        energyLevel: "easy",
        googleMapsQuery: "Suối A Lin Hồng Trung A Lưới"
      });
    }

    // Departure back
    day2Stops.push({
      id: "ve-hue",
      timeSlot: "15:00 - 17:00",
      name: "Tạm Biệt A Lưới & Xuống Đèo QL49 Về Huế",
      enName: "Scenic Descent Along Pass 49 Back To Hue",
      slug: "dich-vu-xe-dua-don-hue-a-luoi",
      category: "Dịch vụ khác",
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
      duration: "2.0h",
      distanceFromPrev: "70km",
      summary: "Khởi hành xuống đèo sớm trước 16:30 để đón cảnh hoàng hôn rực rỡ và tránh sương mù chiều muộn.",
      enSummary: "Descend the mountain pass before 16:30 to enjoy sunset vistas and safely bypass dense evening mist.",
      wisdomTip: "Đi xe máy cần kiểm tra phanh xe, về số thấp (số 2 hoặc 3) khi xuống đèo dốc, không rà phanh liên tục.",
      enWisdomTip: "Motorcyclists: engine-brake on 2nd or 3rd gear; avoid riding brakes continuously on steep descents.",
      energyLevel: "easy",
      googleMapsQuery: "Thành phố Huế"
    });

    days.push({
      dayNumber: 2,
      title: "Ngày 2: Hơi Ấm Suối Khoáng & Tinh Hoa Thổ Cẩm",
      enTitle: "Day 2: Geothermal Warmth & Living Cultural Threads",
      theme: "Thư giãn khoáng chất & Tôn vinh nghề thủ công ngàn đời",
      enTheme: "Thermal Spa Relaxation & Indigenous Craft Immersion",
      stops: day2Stops
    });
  }

  // ================= DAY 3 (If 3 days) =================
  if (duration === "3-days") {
    const day3Stops: ItineraryStop[] = [];

    if (!avoidsHiking && likesHistory) {
      day3Stops.push({
        id: "doi-a-bia",
        timeSlot: "08:00 - 11:30",
        name: "Chinh Phục Đồi A Bia (Hamburger Hill 937)",
        enName: "Ascent to Historic Hill 937 (Hamburger Hill)",
        slug: "doi-a-bia",
        category: "Tham quan",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
        duration: "3.5h",
        distanceFromPrev: "15km",
        summary: "Leo qua các bậc thang rừng nguyên sinh lên đỉnh đồi lịch sử, nghe câu chuyện hòa giải và ngắm thung lũng A Shau hùng vĩ.",
        enSummary: "Hike through lush jungle steps up to the historic peak, hear tales of reconciliation, and survey the vast A Shau Valley.",
        wisdomTip: "Mang giày thể thao bám tốt, mang theo 1 chai nước suối cá nhân và mũ nón che nắng.",
        enWisdomTip: "Wear grippy hiking shoes; carry at least 1L of water and sunscreen / sun hat.",
        energyLevel: "challenging",
        googleMapsQuery: "Di tích Đồi A Bia A Lưới"
      });
    } else {
      day3Stops.push({
        id: "cau-treo-pi-lung",
        timeSlot: "08:30 - 11:00",
        name: "Cầu Treo Pi Lung & Dạo Quanh Bản Làng A Ngo",
        enName: "Pi Lung Suspension Bridge & A Ngo Village Walk",
        slug: "cau-treo-pi-lung-va-check-in",
        category: "Tham quan",
        image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
        duration: "2.5h",
        distanceFromPrev: "8km",
        summary: "Cây cầu treo thanh bình bắc qua dòng sông Đakrông hoang sơ, ngắm nhìn đàn trâu gặm cỏ bên nương rẫy xanh mướt.",
        enSummary: "Rustic suspension bridge swaying gently over river currents; idyllic scenes of water buffaloes grazing along valleys.",
        wisdomTip: "Bước chân nhịp nhàng trên mặt ván cầu; nơi đây chụp ảnh ngược sáng bình minh rất ấn tượng.",
        enWisdomTip: "Walk steadily across wooden planks; exceptional backlit portrait spot in morning light.",
        energyLevel: "easy",
        googleMapsQuery: "Cầu treo Pi Lung A Lưới"
      });
    }

    day3Stops.push({
      id: "dac-san-a-luoi",
      timeSlot: "11:30 - 13:30",
      name: "Chợ Phiên Vùng Cao & Mua Đặc Sản Làm Quà",
      enName: "Highland Market & Local Specialty Gifts",
      slug: "dac-san-thit-bo-gac-bep-va-ruou-can",
      category: "Đặc sản",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
      duration: "2.0h",
      distanceFromPrev: "6km",
      summary: "Chọn mua mật ong rừng nguyên chất, thịt bò cỏ gác bếp sấy củi thơm lừng, gạo Ra Dư đặc sản về làm quà.",
      enSummary: "Pick up genuine wild forest honey, wood-smoked grass-fed beef jerky, and heirloom Ra Du highland rice.",
      wisdomTip: "Hỏi mua mật ong rừng khoái của bà con có nhãn tem OCOP để đảm bảo xuất xứ chuẩn 100%.",
      enWisdomTip: "Look for certified OCOP labels on local forest honey to guarantee authentic origin and purity.",
      energyLevel: "easy",
      googleMapsQuery: "Chợ A Lưới Thừa Thiên Huế"
    });

    day3Stops.push({
      id: "ve-dich",
      timeSlot: "14:30 - 17:00",
      name: "Khởi Hành Trở Về Cố Đô Huế An Toàn",
      enName: "Final Return Journey to Hue Citadel",
      slug: "dich-vu-xe-dua-don-hue-a-luoi",
      category: "Dịch vụ khác",
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
      duration: "2.5h",
      distanceFromPrev: "70km",
      summary: "Kết thúc hành trình khám phá trọn vẹn văn hóa, ẩm thực và thiên nhiên kỳ thú của xứ cao nguyên A Lưới.",
      enSummary: "Complete a deep exploration of cultural roots, pristine cascades, and mountain serenity.",
      wisdomTip: "Nghỉ ngơi uống nước tại chân đèo Hồng Hạ trước khi vào trung tâm thành phố.",
      enWisdomTip: "Take a short hydration break at Hong Ha foot pass before merging into city traffic.",
      energyLevel: "easy",
      googleMapsQuery: "Thành phố Huế"
    });

    days.push({
      dayNumber: 3,
      title: "Ngày 3: Dấu Tích Lịch Sử & Hương Vị Núi Rừng",
      enTitle: "Day 3: Historic Footprints & Highland Flavors",
      theme: "Ký ức hào hùng & Món quà đất mẹ Trường Sơn",
      enTheme: "Heroic Memories & Gifts of the Truong Son Soil",
      stops: day3Stops
    });
  }

  // Calculate total distance
  const totalDistanceKm = duration === "1-day" ? 110 : duration === "2-days" ? 175 : 230;

  return {
    id: `al-plan-${Date.now().toString(36)}`,
    title:
      duration === "1-day"
        ? "Chuyến Đi Nhanh Chạm Đại Ngàn A Lưới (1 Ngày)"
        : duration === "2-days"
        ? "Hành Trình Sổ Tay Thổ Cẩm & Tiếng Thác A Lưới (2N1Đ)"
        : "Đại Ngàn Kỳ Vĩ: Trường Sơn & Suối Nước Nóng (3N2Đ)",
    enTitle:
      duration === "1-day"
        ? "Express Touch of A Luoi Mountain (Day Trip)"
        : duration === "2-days"
        ? "Zèng Journal & Cascade Odyssey (2D1N)"
        : "Grand Truong Son & Geothermal Expedition (3D2N)",
    duration,
    transport,
    companion,
    totalDistanceKm,
    energyRating,
    estBudgetPerPerson: estBudget,
    days,
    likes,
    dislikes,
    safetyTips: [
      "Đoạn đèo A Co (QL49) quanh co dốc cao. Xe máy tuyệt đối không tắt máy thả trôi, dùng số 2-3 hãm tốc.",
      "Sau 16:30 chiều sương mù đèo hạ thấp rất nhanh, tầm nhìn hạn chế. Hãy về trước khi trời tối.",
      "Vùng núi sóng 4G một số đoạn hẻm có thể yếu. Hãy chụp màn hình hoặc lưu lịch trình offline.",
      "Nhiệt độ ban đêm se lạnh (17-19°C), luôn mang theo một chiếc áo khoác gió nhẹ."
    ],
    enSafetyTips: [
      "Route 49 (A Co Pass) features steep switchbacks. Never coast in neutral; engine-brake in 2nd or 3rd gear.",
      "Thick mountain mist descends rapidly after 16:30. Aim to clear the pass before sunset.",
      "Mobile cellular signals may fluctuate in deep gorges. Screenshot or cache this page offline.",
      "Highland nights are crisp (17-19°C). Pack a light windbreaker or fleece layer."
    ],
    culturalRules: [
      "Khi vào nhà Rông / nhà Moong, hãy xin phép hoặc đi cùng hướng dẫn viên người bản địa.",
      "Không tự ý gõ chiêng cồng hoặc chạm tay vào vật linh thiêng treo trên cột cái.",
      "Uống rượu Đoác bằng hai tay khi được gia chủ người Pa Cô, Tà Ôi mời để bày tỏ lòng quý trọng.",
      "Trang phục tắm thác kín đáo, lịch sự, tôn trọng không gian sinh hoạt của bà con."
    ],
    enCulturalRules: [
      "Always greet village elders or accompany a local guide when visiting sacred communal Rong houses.",
      "Do not touch ceremonial gongs or sacred artifacts hanging on the central pillar without permission.",
      "Receive drinks or gifts with both hands as a traditional gesture of gratitude and mutual respect.",
      "Opt for modest swimwear when taking dips around local waterfalls to respect community customs."
    ],
    packingList: [
      "Giày thể thao có đế bám tốt chống trơn trượt khi lội đá suối.",
      "Đồ bơi, khăn tắm cá nhân và túi chống nước cho điện thoại.",
      "Áo khoác mỏng chống sương, kem chống muỗi / xịt côn trùng.",
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
