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
}

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
    }
  }
};
