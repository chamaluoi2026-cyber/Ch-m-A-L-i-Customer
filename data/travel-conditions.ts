export interface TravelConditions {
  updatedAt: string;
  temperature: string;
  weatherState: "sunny" | "cloudy" | "cool" | "light_rain" | "rainy";
  weatherLabel: string;
  roadStatus: "good" | "caution" | "maintenance";
  roadLabel: string;
  waterfallStatus: "open" | "high_water_warning";
  waterfallLabel: string;
  hotSpringStatus: "active" | "maintenance";
  hotSpringLabel: string;
  advisoryNote: string;
}

export const defaultTravelConditions: TravelConditions = {
  updatedAt: new Date().toISOString(),
  temperature: "24°C",
  weatherState: "light_rain",
  weatherLabel: "Mưa nhẹ đầu mùa, se lạnh",
  roadStatus: "good",
  roadLabel: "QL49 thông thoáng, đèo êm",
  waterfallStatus: "open",
  waterfallLabel: "Thác A Nôr nước trong, mở đón khách",
  hotSpringStatus: "active",
  hotSpringLabel: "Suối nước nóng A Roàng hoạt động tốt",
  advisoryNote: "Thời tiết miền núi se lạnh về chiều, nên mang áo khoác mỏng hoặc áo mưa nhẹ khi đi xe máy."
};
