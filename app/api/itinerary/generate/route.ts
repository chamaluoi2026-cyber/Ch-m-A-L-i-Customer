import { NextRequest, NextResponse } from "next/server";
import {
  generateHighlandItinerary,
  enrichPlanWithPlaces,
  ItineraryPlan,
  TripDuration,
  TransportType,
  TravelCompanion,
  DepartureTime
} from "@/lib/highland-itinerary-engine";
import { getActivePlacesAsync } from "@/lib/places";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      duration = "2-days",
      transport = "motorbike",
      companion = "friends",
      departureTime = "07:30",
      departureDate,
      likes = [],
      dislikes = [],
      customRequest = "",
      language = "vi"
    } = body;

    // 1. Lấy dữ liệu dự báo thời tiết 7 ngày từ Open-Meteo (A Lưới: 16.22°N, 107.31°E)
    let isRainy = false;
    let weatherForecast = {
      condition: "Thời tiết mát mẻ vùng cao",
      tempMax: 26,
      tempMin: 18,
      rainChance: 20
    };

    try {
      const weatherRes = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=16.22&longitude=107.31&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FHo_Chi_Minh&forecast_days=7",
        { signal: AbortSignal.timeout(3500) }
      );
      if (weatherRes.ok) {
        const wData = await weatherRes.json();
        const times: string[] = wData.daily?.time || [];
        // Khớp ngày khởi hành với ngày trong dự báo thời tiết
        let targetIdx = departureDate ? times.indexOf(departureDate) : 0;
        if (targetIdx < 0) targetIdx = 0; // Nếu ngày xa hơn 7 ngày thì lấy ngày gần nhất

        const maxT = Math.round(wData.daily?.temperature_2m_max?.[targetIdx] ?? 26);
        const minT = Math.round(wData.daily?.temperature_2m_min?.[targetIdx] ?? 18);
        const rain = wData.daily?.precipitation_probability_max?.[targetIdx] ?? 20;
        const wCode = wData.daily?.weathercode?.[targetIdx] ?? 0;
        isRainy = rain >= 50 || [51, 53, 55, 61, 63, 65, 80, 81, 82, 95].includes(wCode);
        weatherForecast = {
          condition: isRainy ? "Độ ẩm cao, có mưa/sương mù" : (wCode === 0 ? "Nắng đẹp" : "Nhiều mây mát mẻ"),
          tempMax: maxT,
          tempMin: minT,
          rainChance: rain
        };
      }
    } catch {
      // Dùng fallback mặc định
    }

    // 2. Thuật toán AI tạo khung lịch trình thích ứng theo thời tiết, ngày đi & phương tiện
    const activePlaces = await getActivePlacesAsync();
    const rawPlan = generateHighlandItinerary({
      duration: duration as TripDuration,
      transport: transport as TransportType,
      companion: companion as TravelCompanion,
      departureTime: departureTime as DepartureTime,
      departureDate,
      likes,
      dislikes,
      isRainy,
      weatherForecast
    });
    // Đồng bộ ảnh thực tế từ kho Điểm đến do Admin quản lý
    const basePlan = enrichPlanWithPlaces(rawPlan, activePlaces);

    const apiKey = process.env.GEMINI_API_KEY;

    // 3. Nếu có Gemini API Key: Kích hoạt Gemini 2.5 Flash làm Chuyên Gia Cố Vấn Khí Hậu & Lịch Trình
    if (apiKey) {
      try {
        const placesCatalog = activePlaces
          .slice(0, 25)
          .map(
            (p) =>
              `- [${p.name}] (Loại: ${p.category}, Điểm đặc sắc: ${p.highlights?.join(", ") || p.summary}, Hoạt động: ${p.activities?.join(", ") || "Tham quan"}, Ưu đãi: ${p.voucherOffer || "Ưu đãi đặt trước"}, Phù hợp: ${p.suitableFor?.join(", ") || "Mọi người"})`
          )
          .join("\n");

        const prompt = `
Bạn là "Hội đồng Cố vấn Khí hậu & Lịch trình Bản địa" của Chạm A Lưới (A Lưới, Thừa Thiên Huế).
Khách hàng vừa gửi yêu cầu:
- Thời lượng: ${duration}
- Phương tiện: ${transport}
- Bạn đồng hành: ${companion}
- Khung giờ xuất phát: ${departureTime}
- Ngày khởi hành dự kiến: ${departureDate || "Hôm nay"}
- Thích: ${likes.join(", ") || "Khám phá tự nhiên"}
- Tránh: ${dislikes.join(", ") || "Không có"}
- Dự báo thời tiết A Lưới cho ngày khởi hành: ${weatherForecast.condition}, nhiệt độ ${weatherForecast.tempMin}°C - ${weatherForecast.tempMax}°C, xác suất mưa ${weatherForecast.rainChance}%
- Yêu cầu riêng: "${customRequest || "Không có"}"

Cấu trúc lịch trình cơ bản:
Tiêu đề: ${basePlan.title}
Tổng cự ly: ${basePlan.totalDistanceKm}km qua đèo QL49
Các điểm dừng chính: ${basePlan.days.map(d => d.stops.map(s => s.name).join(", ")).join("; ")}

DANH MỤC ĐỊA ĐIỂM THỰC TẾ & MỚI NHẤT TRÊN HỆ THỐNG CHẠM A LƯỚI (DO BAN QUẢN TRỊ CẬP NHẬT):
${placesCatalog}

NHIỆM VỤ CỦA BẠN:
1. Phân tích tác động của thời tiết / mùa này ở A Lưới lên chuyến đi của khách.
2. ĐỐI CHIẾU GU CỦA KHÁCH VỚI DANH MỤC ĐỊA ĐIỂM Ở TRÊN:
   - Hãy chủ động tìm trong danh mục xem có địa điểm nào (đặc biệt là các địa điểm hoang sơ, mới cập nhật, hoặc quán ăn / homestay phù hợp) để ĐỀ XUẤT VÀ NHẮC TÊN CỤ THỂ trong "personalizedIntro" và "adaptiveActions".
   - Nhấn mạnh điểm đó mang lại trải nghiệm bản địa đặc biệt gì cho khách.
3. Đưa ra các dự đoán & lời khuyên thực tế: điều kiện đèo QL49 theo giờ xuất phát ${departureTime}, khả năng săn mây Đồi Thông, an toàn suối thác, và trang phục thích ứng.
4. Cho biết AI đã tự động điều chỉnh hoặc gợi ý phương án linh hoạt như thế nào nếu thời tiết thay đổi.

Trả về duy nhất định dạng JSON:
{
  "personalizedIntro": "3-4 câu lời khuyên sắc bén, phân tích vì sao lịch trình và giờ xuất phát này phù hợp nhất với thời tiết và gu của khách, nêu đích danh địa điểm nổi bật/mới phù hợp",
  "enPersonalizedIntro": "English version of personalizedIntro",
  "seasonInsight": "Phân tích 2-3 câu về đặc trưng mùa và khí hậu A Lưới tháng này (độ ẩm, chênh lệch nhiệt ngày/đêm 6-8 độ)",
  "enSeasonInsight": "English version of seasonInsight",
  "aiAlerts": [
    "Cảnh báo 1 về đèo QL49 hoặc sương mù",
    "Cảnh báo 2 về thời tiết nước suối hoặc săn mây",
    "Cảnh báo 3 về trang phục hoặc lưu ý an toàn ban đêm"
  ],
  "enAiAlerts": [
    "Alert 1 in English",
    "Alert 2 in English",
    "Alert 3 in English"
  ],
  "adaptiveActions": [
    "Điều chỉnh 1 mà AI đề xuất theo thời tiết (gợi ý điểm đến/hoạt động cụ thể)",
    "Điều chỉnh 2 tối ưu theo khung giờ xuất phát",
    "Phương án dự phòng 3 nếu gặp mưa"
  ],
  "enAdaptiveActions": [
    "Action 1 in English",
    "Action 2 in English",
    "Action 3 in English"
  ]
}
`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: "application/json", temperature: 0.6 }
            }),
            signal: AbortSignal.timeout(9000)
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            const currentAdvisory = basePlan.weatherAdvisory;

            return NextResponse.json({
              plan: {
                ...basePlan,
                isGeminiPowered: true,
                geminiIntro: parsed.personalizedIntro || basePlan.geminiIntro,
                enGeminiIntro: parsed.enPersonalizedIntro || basePlan.enGeminiIntro,
                weatherAdvisory: {
                  ...currentAdvisory,
                  seasonName: currentAdvisory?.seasonName || "Khí Hậu Cao Nguyên A Lưới",
                  enSeasonName: currentAdvisory?.enSeasonName || "A Luoi Highland Climate",
                  conditionSummary: parsed.seasonInsight || currentAdvisory?.conditionSummary || "",
                  enConditionSummary: parsed.enSeasonInsight || currentAdvisory?.enConditionSummary || "",
                  tempRange: currentAdvisory?.tempRange || `${weatherForecast.tempMin}°C - ${weatherForecast.tempMax}°C`,
                  rainRisk: currentAdvisory?.rainRisk || "low",
                  cloudHuntingRating: currentAdvisory?.cloudHuntingRating || "excellent",
                  aiAlerts: parsed.aiAlerts?.length ? parsed.aiAlerts : currentAdvisory?.aiAlerts || [],
                  enAiAlerts: parsed.enAiAlerts?.length ? parsed.enAiAlerts : currentAdvisory?.enAiAlerts || [],
                  adaptiveActions: parsed.adaptiveActions?.length ? parsed.adaptiveActions : currentAdvisory?.adaptiveActions || [],
                  enAdaptiveActions: parsed.enAdaptiveActions?.length ? parsed.enAdaptiveActions : currentAdvisory?.enAdaptiveActions || []
                }
              }
            });
          }
        }
      } catch (geminiError) {
        console.warn("Gemini 2.5 Flash call failed, falling back to local advisory:", geminiError);
      }
    }

    // Default fallback to highland engine
    return NextResponse.json({
      plan: {
        ...basePlan,
        isGeminiPowered: Boolean(apiKey)
      }
    });
  } catch (error) {
    console.error("Itinerary generation error:", error);
    return NextResponse.json({ error: "Failed to generate itinerary" }, { status: 500 });
  }
}