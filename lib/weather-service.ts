"use client";

export const A_LUOI_LAT = 16.232;
export const A_LUOI_LON = 107.261;
export const A_LUOI_ELEVATION = 620;

export interface CurrentWeather {
  temp: number;
  apparentTemp: number;
  humidity: number;
  weatherCode: number;
  windSpeed: number;
  isDay: boolean;
  label: string;
  enLabel: string;
}

export interface DayForecast {
  date: string;
  dayName: string;
  enDayName: string;
  weatherCode: number;
  emoji: string;
  label: string;
  enLabel: string;
  tempMax: number;
  tempMin: number;
  rainChance: number;
  precipitationSum?: number;
  isCloudHuntingGood: boolean;
  specialNote: string;
  enSpecialNote: string;
  passAlert: string;
  enPassAlert: string;
  passStatus: "normal" | "slippery" | "foggy" | "warning";
}

export interface UnifiedWeatherData {
  current: CurrentWeather;
  forecasts: DayForecast[];
  updatedAt: number;
}

export function wmoToDisplay(code: number): { emoji: string; label: string; enLabel: string } {
  if (code === 0) return { emoji: "☀️", label: "Nắng đẹp", enLabel: "Clear Sky" };
  if (code === 1) return { emoji: "🌤️", label: "Ít mây", enLabel: "Mostly Sunny" };
  if (code === 2) return { emoji: "⛅", label: "Nhiều mây", enLabel: "Partly Cloudy" };
  if (code === 3) return { emoji: "🌥️", label: "Trời xám", enLabel: "Overcast" };
  if (code === 45 || code === 48) return { emoji: "🌫️", label: "Sương mù đèo ✨", enLabel: "Mountain Fog ✨" };
  if (code >= 51 && code <= 55) return { emoji: "🌦️", label: "Mưa phùn", enLabel: "Drizzle" };
  if (code >= 61 && code <= 65) return { emoji: "🌧️", label: "Mưa", enLabel: "Rain" };
  if (code >= 71 && code <= 77) return { emoji: "🌨️", label: "Mưa đá nhẹ", enLabel: "Light Sleet" };
  if (code >= 80 && code <= 82) return { emoji: "⛈️", label: "Mưa rào", enLabel: "Showers" };
  if (code === 95) return { emoji: "⛈️", label: "Giông bão", enLabel: "Thunderstorm" };
  return { emoji: "🌈", label: "Biến thiên", enLabel: "Variable" };
}

export function getDayName(dateStr: string): { dayName: string; enDayName: string } {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((date.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return { dayName: "Hôm nay", enDayName: "Today" };
  if (diff === 1) return { dayName: "Ngày mai", enDayName: "Tomorrow" };
  const viDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const enDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return { dayName: viDays[date.getDay()], enDayName: enDays[date.getDay()] };
}

export function getDayAdvisories(
  code: number,
  rainChance: number,
  tempMax: number,
  tempMin: number,
  isCloudHuntingGood: boolean
): {
  specialNote: string;
  enSpecialNote: string;
  passAlert: string;
  enPassAlert: string;
  passStatus: "normal" | "slippery" | "foggy" | "warning";
} {
  // 1. Dông bão / Sấm sét (WMO 95)
  if (code === 95) {
    return {
      specialNote: `⚡ Có dông nhiệt vùng cao (${rainChance}% mưa): Sáng tạnh ráo, chiều tối có thể có dông ngắt quãng. Thích hợp ngâm khoáng nóng A Roàng & giao lưu nhà sàn.`,
      enSpecialNote: `⚡ Highland thunderstorms (${rainChance}% rain): Dry morning, showers in afternoon/evening. Great for A Roang hot springs & stilt houses.`,
      passAlert: "Có dông sét và mưa rừng, nguy cơ trơn trượt cao. Nên vượt đèo sớm trước 15:30, tránh qua đèo ban đêm hoặc khi mưa dông lớn.",
      enPassAlert: "Thunderstorms & slippery conditions. Descend pass before 15:30, avoid night travel during heavy downpours.",
      passStatus: "warning"
    };
  }

  // 2. Mưa rào / Mưa to (WMO 80-82, 61-65, hoặc xác suất mưa >= 70%)
  if ((code >= 80 && code <= 82) || (code >= 61 && code <= 65) || rainChance >= 70) {
    return {
      specialNote: `🌧️ Có mưa rào vùng cao (${rainChance}% mưa): Suối khoáng nóng A Roàng 60°C & trải nghiệm dệt thổ cẩm Zèng là lựa chọn tuyệt vời nhất hôm nay.`,
      enSpecialNote: `🌧️ Highland rain showers (${rainChance}% rain): Perfect day for A Roang natural hot springs (60°C) and indoor Zeng craft weaving.`,
      passAlert: "Mưa rừng làm mặt đèo ướt trơn, sương mù phủ kín đèo Mỏ Quạ & A Co. Cần giảm tốc độ, bật đèn cốt và nên xuống đèo trước 16:00.",
      enPassAlert: "Wet & slippery mountain curves. Reduced visibility at passes; slow down, use low beams and descend before 16:00.",
      passStatus: "slippery"
    };
  }

  // 3. Mưa phùn / mưa nhẹ (WMO 51-55 hoặc xác suất mưa 40-69%)
  if ((code >= 51 && code <= 55) || (rainChance >= 40 && rainChance < 70)) {
    return {
      specialNote: `🌦️ Tiết trời se lạnh có mưa bay lất phất (${rainChance}% mưa): Nên mang theo áo khoác gió mỏng và ô nhỏ khi dạo bản làng.`,
      enSpecialNote: `🌦️ Mountain drizzle & cool air (${rainChance}% rain): Pack a light windbreaker and compact umbrella for village walks.`,
      passAlert: "Mặt đường ẩm ướt ở các khúc cua dốc. Lái xe cẩn trọng, giữ cự ly an toàn và hoàn thành chuyến đi trước 16:30.",
      enPassAlert: "Moist road surface on mountain curves. Drive cautiously, keep safe following distance, descend before 16:30.",
      passStatus: "slippery"
    };
  }

  // 4. Sương mù đèo (WMO 45, 48)
  if (code === 45 || code === 48) {
    return {
      specialNote: "🌫️ Sương mù vùng cao bao phủ! Cơ hội săn biển mây thung lũng tuyệt đẹp tại Đồi Thông A Lưới lúc 06:00 - 06:45 sáng.",
      enSpecialNote: "🌫️ Misty highland atmosphere! Prime sea-of-clouds window at A Luoi Pine Hill around 06:00 - 06:45 AM.",
      passAlert: "Sương mù dày đặc che khuất tầm nhìn qua đèo A Co & Mỏ Quạ. Bật đèn gầm, chạy chậm và giữ cự ly tối thiểu 30m.",
      enPassAlert: "Heavy mountain fog at peaks. Use fog lamps, slow down and keep at least 30m distance.",
      passStatus: "foggy"
    };
  }

  // 5. Nắng đẹp trong lành (WMO 0)
  if (code === 0) {
    return {
      specialNote: "☀️ Nắng ráo trong veo: Thời điểm lý tưởng nhất tắm suối Pâr Le, thác A Nôr & chụp ảnh bản làng đại ngàn.",
      enSpecialNote: "☀️ Crystal clear sunny skies: Prime conditions for Par Le stream, A Nor waterfalls, and tribal village photography.",
      passAlert: "Buổi sáng nắng đẹp, mặt đường khô ráo, chạy tốt. Từ 16:30 sương mù hạ thấp, khuyên xuất phát xuống đèo trước 16:30.",
      enPassAlert: "Sunny and dry pass conditions in daytime. Mountain mist lowers after 16:30; descend before dusk for safety.",
      passStatus: "normal"
    };
  }

  // 6. Nhiều mây / Mát mẻ / Săn mây tốt (WMO 1-3)
  if (isCloudHuntingGood) {
    return {
      specialNote: "☁️ Sáng sớm có mây bồng bềnh mát dịu: Rất thích hợp check-in đồi thông, cà phê ngắm cảnh và dạo suối.",
      enSpecialNote: "☁️ Soft morning mountain clouds: Great for scenic pine-hill coffee stops and countryside strolls.",
      passAlert: "Đường đèo thông thoáng, thời tiết mát mẻ. Khuyên kiểm tra hệ thống phanh xe và di chuyển xuống đèo trước 16:30.",
      enPassAlert: "Clear mountain breeze and smooth pavement. Check vehicle brakes and descend before 16:30 before mist sets in.",
      passStatus: "normal"
    };
  }

  // Mặc định
  return {
    specialNote: `🍃 Nhiệt độ vùng cao mát mẻ (${tempMin}°C - ${tempMax}°C), thấp hơn đồng bằng 4-6°C. Thích hợp dạo bản và thưởng thức ẩm thực Pa Cô.`,
    enSpecialNote: `🍃 Pleasant highland climate (${tempMin}°C - ${tempMax}°C). Great for cultural villages and indigenous Pa Co cuisine.`,
    passAlert: "Đường đèo thông thoáng, mặt đường ổn định. Sương mù xuất hiện sau 16:30, nên điều chỉnh hành trình qua đèo sớm.",
    enPassAlert: "Pass is clear and well-conditioned. Mountain mist arrives after 16:30, schedule daytime travel across pass.",
    passStatus: "normal"
  };
}

let cachedData: UnifiedWeatherData | null = null;
let fetchPromise: Promise<UnifiedWeatherData> | null = null;
let lastFetchTime = 0;
const CACHE_MS = 10 * 60 * 1000; // 10 phút

export async function getUnifiedWeatherData(): Promise<UnifiedWeatherData> {
  const now = Date.now();
  if (cachedData && now - lastFetchTime < CACHE_MS) {
    return cachedData;
  }
  if (fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = (async () => {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${A_LUOI_LAT}&longitude=${A_LUOI_LON}&elevation=${A_LUOI_ELEVATION}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=Asia%2FHo_Chi_Minh&forecast_days=5`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch weather");
      const data = await res.json();

      let current: CurrentWeather = {
        temp: 22,
        apparentTemp: 22,
        humidity: 85,
        weatherCode: 2,
        windSpeed: 8,
        isDay: true,
        label: "Nhiều mây dịu mát",
        enLabel: "Partly Cloudy"
      };

      if (data?.current) {
        const c = data.current;
        const { label, enLabel } = wmoToDisplay(c.weather_code);
        current = {
          temp: Math.round(c.temperature_2m),
          apparentTemp: Math.round(c.apparent_temperature),
          humidity: Math.round(c.relative_humidity_2m),
          weatherCode: c.weather_code,
          windSpeed: Math.round(c.wind_speed_10m),
          isDay: Boolean(c.is_day),
          label,
          enLabel
        };
      }

      const forecasts: DayForecast[] = [];
      if (data?.daily?.time) {
        const {
          time,
          weather_code,
          temperature_2m_max,
          temperature_2m_min,
          precipitation_sum,
          precipitation_probability_max
        } = data.daily;

        for (let i = 0; i < time.length; i++) {
          const dateStr = time[i];
          const code = weather_code[i];
          const { emoji, label, enLabel } = wmoToDisplay(code);
          const { dayName, enDayName } = getDayName(dateStr);
          const rainChance = precipitation_probability_max[i] ?? 0;
          const precipitationSum = precipitation_sum?.[i] ?? 0;
          const tempMax = Math.round(temperature_2m_max[i]);
          const tempMin = Math.round(temperature_2m_min[i]);
          const isCloudHuntingGood = code === 45 || code === 48 || (code >= 1 && code <= 3 && rainChance < 30);

          const advisories = getDayAdvisories(
            code,
            rainChance,
            tempMax,
            tempMin,
            isCloudHuntingGood
          );

          const d = new Date(dateStr);
          forecasts.push({
            date: `${d.getDate()}/${d.getMonth() + 1}`,
            dayName,
            enDayName,
            weatherCode: code,
            emoji,
            label,
            enLabel,
            tempMax,
            tempMin,
            rainChance,
            precipitationSum,
            isCloudHuntingGood,
            specialNote: advisories.specialNote,
            enSpecialNote: advisories.enSpecialNote,
            passAlert: advisories.passAlert,
            enPassAlert: advisories.enPassAlert,
            passStatus: advisories.passStatus
          });
        }
      }

      cachedData = {
        current,
        forecasts,
        updatedAt: Date.now()
      };
      lastFetchTime = Date.now();
      return cachedData;
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
}
