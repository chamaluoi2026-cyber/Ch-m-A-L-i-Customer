export type Language = "vi" | "en";

export interface Translations {
  // Navigation & Common
  nav: {
    home: string;
    places: string;
    itineraryAI: string;
    itineraryAIBadge: string;
    blog: string;
    products: string;
    bookTour: string;
    about: string;
    login: string;
    account: string;
  };
  // Common CTA
  common: {
    back: string;
    next: string;
    finish: string;
    exploreNow: string;
    viewDetails: string;
    directions: string;
    share: string;
    print: string;
    save: string;
    copied: string;
    recalculate: string;
    editQuiz: string;
    loading: string;
    all: string;
    vietnam: string;
    english: string;
  };
  // Itinerary Quiz
  quiz: {
    heroBadge: string;
    heroTitle: string;
    heroSubtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    durationLabel: string;
    transportLabel: string;
    companionLabel: string;
    likesSectionTitle: string;
    likesSectionDesc: string;
    dislikesSectionTitle: string;
    dislikesSectionDesc: string;
    generateButton: string;
    generatingMessage: string;
  };
  // Itinerary Results View
  itinerary: {
    journalTitle: string;
    journalSubtitle: string;
    overviewTab: string;
    timelineTab: string;
    tipsTab: string;
    totalDistance: string;
    energyLevel: string;
    estBudget: string;
    stopsCount: string;
    energyEasy: string;
    energyModerate: string;
    energyChallenging: string;
    morning: string;
    afternoon: string;
    evening: string;
    day1Title: string;
    day2Title: string;
    day3Title: string;
    distanceFromPrev: string;
    localWisdom: string;
    openInMaps: string;
    swapPlace: string;
    safetyTitle: string;
    cultureTitle: string;
    packingTitle: string;
    startOver: string;
  };
  // About Page
  about: {
    badge: string;
    title: string;
    subtitle: string;
    commitment1: string;
    commitment2: string;
    teamEyebrow: string;
    teamTitle: string;
    teamDesc: string;
    impactTitle: string;
    partnersTitle: string;
    partnersText: string;
    defaultMission: string;
    defaultVision: string;
    defaultValues: string;
    defaultImpact1: string;
    defaultImpact2: string;
    defaultImpact3: string;
    defaultImpact4: string;
  };
  // Home Page
  home: {
    heroTag: string;
    heroTitle: string;
    heroDesc: string;
    heroExploreBtn: string;
    heroBookTourBtn: string;
    featuredEyebrow: string;
    featuredTitle: string;
    featuredDesc: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    viewAllPlaces: string;
    bookingEyebrow: string;
    bookingTitle: string;
    bookingDesc: string;
    packageTourTitle: string;
    packageTourDesc: string;
    packageTourBtn: string;
    selfGuidedTitle: string;
    selfGuidedDesc: string;
    selfGuidedBtn: string;
    galleryEyebrow: string;
    galleryTitle: string;
    galleryDesc: string;
    homestayEyebrow: string;
    homestayTitle: string;
    specialtiesEyebrow: string;
    specialtiesTitle: string;
    blogEyebrow: string;
    blogTitle: string;
    readArticle: string;
    testimonialsEyebrow: string;
    testimonialsTitle: string;
  };
}

export const categoryTranslations: Record<string, { vi: string; en: string }> = {
  all: { vi: "Tất cả", en: "All" },
  food: { vi: "Ăn uống", en: "Food & Dining" },
  stay: { vi: "Lưu trú", en: "Homestays & Stays" },
  play: { vi: "Vui chơi", en: "Recreation" },
  experience: { vi: "Trải nghiệm", en: "Experiences" },
  "waterfall-stream": { vi: "Thác và suối", en: "Waterfalls & Streams" },
  outdoor: { vi: "Hoạt động ngoài trời", en: "Outdoor Activities" },
  campfire: { vi: "Lửa trại", en: "Campfire & Gongs" },
  "community-tourism": { vi: "Khu du lịch cộng đồng", en: "Community Tourism" },
  visit: { vi: "Tham quan", en: "Sightseeing" },
  culture: { vi: "Văn hóa", en: "Culture & Crafts" },
  specialty: { vi: "Đặc sản", en: "Highland Specialties" },
  service: { vi: "Dịch vụ khác", en: "Local Services" }
};

export const translations: Record<Language, Translations> = {
  vi: {
    nav: {
      home: "Trang chủ",
      places: "Địa điểm",
      itineraryAI: "Lịch trình AI",
      itineraryAIBadge: "MỚI",
      blog: "Cẩm nang",
      products: "Đặc sản",
      bookTour: "Đặt tour",
      about: "Giới thiệu",
      login: "Đăng nhập",
      account: "Tài khoản"
    },
    common: {
      back: "Quay lại",
      next: "Tiếp tục",
      finish: "Hoàn tất",
      exploreNow: "Khám phá ngay",
      viewDetails: "Xem chi tiết",
      directions: "Chỉ đường",
      share: "Chia sẻ lịch trình",
      print: "In / Tải về",
      save: "Lưu hành trình",
      copied: "Đã sao chép liên kết!",
      recalculate: "Tối ưu lại",
      editQuiz: "Tùy chỉnh sở thích",
      loading: "Đang tải dữ liệu...",
      all: "Tất cả",
      vietnam: "Tiếng Việt",
      english: "English"
    },
    quiz: {
      heroBadge: "Trợ lý du lịch đại ngàn 4.0",
      heroTitle: "Thiết Kế Lịch Trình A Lưới Độc Bản Dành Riêng Cho Bạn",
      heroSubtitle:
        "Trả lời nhanh vài câu hỏi về sở thích & những điều muốn tránh. Trí tuệ nhân tạo sẽ gom cụm địa lý đèo dốc để tạo nên hành trình trọn vẹn, không mệt mỏi.",
      step1Title: "1. Thời gian & Phương tiện",
      step1Desc: "Chọn thời lượng chuyến viễn du và cách bạn di chuyển lên A Lưới.",
      step2Title: "2. Đối tượng đồng hành",
      step2Desc: "Giúp chúng tôi gợi ý nhịp độ di chuyển và điểm dừng phù hợp nhất.",
      step3Title: "3. Những trải nghiệm bạn MÊ ĐẮM (Chọn nhiều)",
      step3Desc: "Hệ thống sẽ ưu tiên tối đa các điểm đến mang lại cảm xúc này.",
      step4Title: "4. Những điều bạn MUỐN TRÁNH (Chọn để loại trừ)",
      step4Desc: "AI sẽ loại bỏ hoàn toàn các điểm có yếu tố làm bạn khó chịu hoặc kiệt sức.",
      durationLabel: "Thời gian lưu lại:",
      transportLabel: "Phương tiện:",
      companionLabel: "Bạn đi cùng:",
      likesSectionTitle: "Bạn đặc biệt hứng thú với:",
      likesSectionDesc: "Chạm để chọn các trải nghiệm mong muốn xuất hiện trong chuyến đi",
      dislikesSectionTitle: "Bạn muốn né tránh điều gì?",
      dislikesSectionDesc: "Chạm để loại bỏ các trải nghiệm không phù hợp với thể lực hay thói quen",
      generateButton: "Kiến tạo Lịch trình Đại ngàn ngay",
      generatingMessage: "AI đang tối ưu hóa cung đường và lọc điểm đến..."
    },
    itinerary: {
      journalTitle: "Hành Trình Sổ Tay Thổ Cẩm",
      journalSubtitle: "Lịch trình cá nhân hóa được tối ưu theo thời gian thực và cung đường đèo QL49",
      overviewTab: "Tổng quan hành trình",
      timelineTab: "Chi tiết lộ trình từng ngày",
      tipsTab: "Chỉ dẫn thổ địa & An toàn",
      totalDistance: "Tổng cự ly đèo & suối",
      energyLevel: "Cường độ thể lực",
      estBudget: "Dự toán ước tính",
      stopsCount: "Trạm dừng chân",
      energyEasy: "Nhẹ nhàng & Chữa lành",
      energyModerate: "Vừa sức, thư thái",
      energyChallenging: "Khám phá & Thử thách",
      morning: "Buổi sáng",
      afternoon: "Buổi chiều",
      evening: "Buổi tối",
      day1Title: "Ngày 1: Tiếng Gọi Đại Ngàn & Cung Đèo Mây Phủ",
      day2Title: "Ngày 2: Di Sản Dèng Tà Ôi & Dòng Nước Ấm A Roàng",
      day3Title: "Ngày 3: Dấu Tích Lịch Sử & Thung Lũng Sương Mù",
      distanceFromPrev: "Cách điểm trước",
      localWisdom: "Bí quyết từ già làng:",
      openInMaps: "Xem trên Google Maps",
      swapPlace: "Đổi điểm khác",
      safetyTitle: "Lưu ý an toàn đường đèo & thời tiết",
      cultureTitle: "Phong tục & Quy tắc ứng xử bản làng",
      packingTitle: "Hành lý khuyên mang theo",
      startOver: "Thiết kế lại lịch trình khác"
    },
    about: {
      badge: "Về chúng tôi",
      title: "Cầu nối số cho du lịch cộng đồng",
      subtitle: "Chạm A Lưới là nền tảng du lịch trung gian giúp kết nối du khách với nét đẹp văn hóa bản địa, các chủ nhà homestay ấm áp, đơn vị dịch vụ trách nhiệm và những nghệ nhân vùng cao kiên trì gìn giữ nghề truyền thống.",
      commitment1: "Minh bạch đối soát",
      commitment2: "Đồng hành cùng bà con",
      teamEyebrow: "Con người đằng sau dự án",
      teamTitle: "Đội ngũ sáng lập & Nghệ nhân A Lưới",
      teamDesc: "Sự kết hợp giữa nhiệt huyết của những người trẻ yêu du lịch trải nghiệm và kinh nghiệm, sự chân thành của đồng bào địa phương tại thung lũng A Lưới.",
      impactTitle: "Tác động cộng đồng",
      partnersTitle: "Mạng lưới Đối tác",
      partnersText: "Các gia đình homestay địa phương, hợp tác xã dệt thổ cẩm Zèng A Đớt, các đội trekking rừng nguyên sinh, đơn vị lữ hành Huế và các giảng viên cố vấn phát triển cộng đồng.",
      defaultMission: "Sứ mệnh",
      defaultVision: "Tầm nhìn",
      defaultValues: "Giá trị cốt lõi",
      defaultImpact1: "Tạo thu nhập trực tiếp cho chủ nhà và nghệ nhân địa phương",
      defaultImpact2: "Bảo tồn văn hóa thông qua trải nghiệm có hướng dẫn",
      defaultImpact3: "Giáo dục du lịch có trách nhiệm cho du khách",
      defaultImpact4: "Tăng khả năng tiếp cận thị trường cho sản phẩm vùng cao"
    },
    home: {
      heroTag: "Du lịch cộng đồng tại Huế",
      heroTitle: "Chạm A Lưới",
      heroDesc: "Nơi du khách tìm địa điểm đáng tin cậy, nhận voucher trước khi tư vấn và kết nối trực tiếp với doanh nghiệp địa phương.",
      heroExploreBtn: "Khám phá địa điểm",
      heroBookTourBtn: "Đặt tour",
      featuredEyebrow: "Khám phá địa điểm",
      featuredTitle: "Chọn nơi muốn đến, nhận ưu đãi rồi được tư vấn",
      featuredDesc: "Chạm A Lưới giúp bạn tìm địa điểm ăn uống, lưu trú, vui chơi và trải nghiệm cộng đồng phù hợp trước khi lên lịch.",
      step1Title: "1. Chọn địa điểm",
      step1Desc: "Khách xem ăn uống, lưu trú, vui chơi, trải nghiệm, đặc sản và dịch vụ tại A Lưới.",
      step2Title: "2. Nhận voucher",
      step2Desc: "Khách để lại thông tin, hệ thống tạo mã voucher trước khi mở nút chat Zalo.",
      step3Title: "3. Được tư vấn",
      step3Desc: "Đội ngũ địa phương hỗ trợ lịch trình, thời gian phù hợp, dịch vụ đi kèm và cách sử dụng voucher.",
      viewAllPlaces: "Xem tất cả địa điểm",
      bookingEyebrow: "Đặt chuyến đi",
      bookingTitle: "Tour và tự túc vẫn là nhánh dịch vụ riêng",
      bookingDesc: "Khách muốn lịch trình hoàn chỉnh có thể đặt tour trọn gói. Khách muốn tự chọn homestay và trải nghiệm có thể đi theo luồng tự túc.",
      packageTourTitle: "Đặt tour trọn gói",
      packageTourDesc: "Phù hợp với khách muốn lịch trình hoàn chỉnh do công ty lữ hành tổ chức.",
      packageTourBtn: "Khám phá tour",
      selfGuidedTitle: "Du lịch tự túc",
      selfGuidedDesc: "Tự chọn homestay và các trải nghiệm theo nhu cầu của bạn.",
      selfGuidedBtn: "Bắt đầu lên kế hoạch",
      galleryEyebrow: "Khung ảnh A Lưới",
      galleryTitle: "Xem A Lưới qua những khung hình rộng mở",
      galleryDesc: "Một góc thị giác dành riêng cho núi rừng, thác nước, bình minh và bản làng trước khi du khách chọn hành trình.",
      homestayEyebrow: "Homestay nổi bật",
      homestayTitle: "Lưu trú giữa núi rừng và sự ấm áp cộng đồng",
      specialtiesEyebrow: "Sản phẩm địa phương",
      specialtiesTitle: "Thủ công, hương vị và ký ức từ vùng cao",
      blogEyebrow: "Blog mới nhất",
      blogTitle: "Những câu chuyện trước hành trình",
      readArticle: "Đọc bài viết",
      testimonialsEyebrow: "Cảm nhận",
      testimonialsTitle: "Du khách nhớ nhất những chi tiết con người"
    }
  },
  en: {
    nav: {
      home: "Home",
      places: "Destinations",
      itineraryAI: "AI Planner",
      itineraryAIBadge: "NEW",
      blog: "Travel Guide",
      products: "Specialties",
      bookTour: "Book Tours",
      about: "About Us",
      login: "Sign In",
      account: "Profile"
    },
    common: {
      back: "Back",
      next: "Continue",
      finish: "Finish",
      exploreNow: "Explore Now",
      viewDetails: "View Details",
      directions: "Directions",
      share: "Share Itinerary",
      print: "Print / PDF",
      save: "Save Journey",
      copied: "Link copied to clipboard!",
      recalculate: "Re-optimize",
      editQuiz: "Edit Preferences",
      loading: "Loading information...",
      all: "All",
      vietnam: "Tiếng Việt",
      english: "English"
    },
    quiz: {
      heroBadge: "Highland Travel Intelligence",
      heroTitle: "Craft Your Bespoke A Luoi Expedition",
      heroSubtitle:
        "Answer a few quick questions about what you love and what you want to avoid. Our smart engine optimizes mountain routes to deliver an effortless, tailored experience.",
      step1Title: "1. Duration & Transportation",
      step1Desc: "Choose how long you will stay and how you wish to travel across the mountains.",
      step2Title: "2. Travel Companions",
      step2Desc: "Helps us tune the pace and activities to suit your travel group.",
      step3Title: "3. Experiences You LOVE (Select Multiple)",
      step3Desc: "Our engine will prioritize destinations and activities that match these passions.",
      step4Title: "4. Things You Want to AVOID (Exclusions)",
      step4Desc: "AI will strictly eliminate spots with factors that might cause discomfort or fatigue.",
      durationLabel: "Duration:",
      transportLabel: "Transport:",
      companionLabel: "Traveling with:",
      likesSectionTitle: "What you are excited about:",
      likesSectionDesc: "Tap to include the highlights you crave the most",
      dislikesSectionTitle: "What would you rather skip?",
      dislikesSectionDesc: "Tap to filter out activities that don't match your fitness or preferences",
      generateButton: "Generate My Highland Itinerary",
      generatingMessage: "AI is mapping optimal passes and filtering destinations..."
    },
    itinerary: {
      journalTitle: "Zèng Highland Expedition Journal",
      journalSubtitle: "Personalized journey optimized in real-time along Route 49 and Ho Chi Minh highway",
      overviewTab: "Trip Overview",
      timelineTab: "Daily Timeline",
      tipsTab: "Local Wisdom & Safety",
      totalDistance: "Mountain Route Distance",
      energyLevel: "Pace & Energy Level",
      estBudget: "Est. Budget / Person",
      stopsCount: "Curated Stops",
      energyEasy: "Easy & Restful Healing",
      energyModerate: "Balanced & Scenic",
      energyChallenging: "Adventurous & Active",
      morning: "Morning",
      afternoon: "Afternoon",
      evening: "Evening",
      day1Title: "Day 1: Whisper of the Forest & The Mist-Crowned Pass",
      day2Title: "Day 2: Sacred Zèng Weaving & Warm Geothermal Springs",
      day3Title: "Day 3: Historical Echoes & The Misty Valley",
      distanceFromPrev: "Distance from previous",
      localWisdom: "Elder's Local Tip:",
      openInMaps: "Navigate on Google Maps",
      swapPlace: "Swap this stop",
      safetyTitle: "Mountain Pass & Weather Safety",
      cultureTitle: "Village Etiquette & Sacred Customs",
      packingTitle: "Recommended Packing Checklist",
      startOver: "Start Over With New Choices"
    },
    about: {
      badge: "About Us",
      title: "The Digital Bridge for Community Tourism",
      subtitle: "Cham A Luoi is a community tourism platform connecting travelers with authentic highland culture, warm local homestays, responsible service providers, and skilled indigenous artisans preserving traditional crafts.",
      commitment1: "Transparent & Accountable",
      commitment2: "Uplifting Local Communities",
      teamEyebrow: "The People Behind the Project",
      teamTitle: "Founding Team & A Luoi Artisans",
      teamDesc: "A unique blend of passionate young travel enthusiasts and the genuine wisdom of indigenous community members from the A Luoi valley.",
      impactTitle: "Community Impact",
      partnersTitle: "Our Partner Network",
      partnersText: "Local homestay families, the Zèng A Đớt traditional weaving cooperative, old-growth forest trekking teams, Hue travel agencies, and community development advisors.",
      defaultMission: "Mission",
      defaultVision: "Vision",
      defaultValues: "Core Values",
      defaultImpact1: "Creating direct income for local hosts and artisans",
      defaultImpact2: "Preserving culture through guided immersive experiences",
      defaultImpact3: "Educating travelers in responsible, sustainable tourism",
      defaultImpact4: "Expanding market access for highland community products"
    },
    home: {
      heroTag: "Community-Based Tourism in Hue",
      heroTitle: "Cham A Luoi",
      heroDesc: "Discover verified highland destinations, claim exclusive vouchers, and connect directly with local community hosts.",
      heroExploreBtn: "Explore Destinations",
      heroBookTourBtn: "Book Tours",
      featuredEyebrow: "Explore Destinations",
      featuredTitle: "Choose your destination, claim offers, and get local advice",
      featuredDesc: "Cham A Luoi helps you discover dining, stays, attractions, and community experiences before planning your trip.",
      step1Title: "1. Choose Destination",
      step1Desc: "Explore dining, homestays, waterfalls, cultural workshops, and highland specialties.",
      step2Title: "2. Claim Voucher",
      step2Desc: "Enter your information to generate an instant voucher code before connecting via chat.",
      step3Title: "3. Get Local Advice",
      step3Desc: "Our local highland team assists with custom timing, transport, and redeeming your vouchers.",
      viewAllPlaces: "View All Destinations",
      bookingEyebrow: "Plan Your Journey",
      bookingTitle: "All-inclusive guided tours or self-guided exploration",
      bookingDesc: "Choose all-inclusive packages for stress-free guided tours, or curate your own stays and experiences independently.",
      packageTourTitle: "All-Inclusive Tour Packages",
      packageTourDesc: "Ideal for travelers seeking fully-guided itineraries curated by local tour operators.",
      packageTourBtn: "Explore Tours",
      selfGuidedTitle: "Self-Guided Travel",
      selfGuidedDesc: "Handpick your own homestays, waterfalls, and cultural workshops at your own pace.",
      selfGuidedBtn: "Start Planning",
      galleryEyebrow: "A Luoi Gallery",
      galleryTitle: "Experience A Luoi Through Scenic Panoramas",
      galleryDesc: "A visual glimpse of ancient rainforests, white waterfalls, misty sunrises, and indigenous villages.",
      homestayEyebrow: "Featured Homestays",
      homestayTitle: "Rest Amidst Mountains and Warm Community Hospitality",
      specialtiesEyebrow: "Highland Specialties",
      specialtiesTitle: "Crafts, flavors, and authentic memories from the highlands",
      blogEyebrow: "Latest Stories",
      blogTitle: "Stories Before Your Journey",
      readArticle: "Read Story",
      testimonialsEyebrow: "Testimonials",
      testimonialsTitle: "What travelers remember most is the warmth of the people"
    }
  }
};
