export const VEHICLE_CATEGORY_PRESETS = [
  { key: "sedan", name: "Sedan", image: "/vehicle-categories/Sedan.png" },
  { key: "hatchback", name: "Hatchback", image: "/vehicle-categories/Hatchback.png" },
  { key: "compact-suv", name: "Compact SUV", image: "/vehicle-categories/Compact-SUV.png" },
  { key: "full-size-suv", name: "Full-Size SUV", image: "/vehicle-categories/Full-Size-SUV.png" },
  { key: "crossover", name: "Crossover", image: "/vehicle-categories/Crossover.png" },
  { key: "coupe", name: "Coupe", image: "/vehicle-categories/Coupe.png" },
  { key: "convertible", name: "Convertible", image: "/vehicle-categories/Convertible.png" },
  { key: "station-wagon", name: "Station Wagon", image: "/vehicle-categories/Station-Wagon.png" },
  { key: "pickup-truck", name: "Pickup Truck", image: "/vehicle-categories/Pickup-Truck.png" },
  { key: "double-cabin", name: "Double Cabin", image: "/vehicle-categories/Double-Cabin.png" },
  { key: "minivan", name: "Minivan", image: "/vehicle-categories/Minivan.png" },
  { key: "mpv", name: "MPV", image: "/vehicle-categories/MPV.png" },
  { key: "passenger-van", name: "Passenger Van", image: "/vehicle-categories/Passenger-Van.png" },
  { key: "cargo-van", name: "Cargo Van", image: "/vehicle-categories/Cargo-Van.png" },
  { key: "microcar", name: "Microcar", image: "/vehicle-categories/Microcar.png" },
  { key: "sports-car", name: "Sports Car", image: "/vehicle-categories/Sports-Car.png" },
  { key: "luxury-sedan", name: "Luxury Sedan", image: "/vehicle-categories/Luxury-Sedan.png" },
  { key: "off-road-4x4", name: "Off-Road / 4x4", image: "/vehicle-categories/Off-Road-4x4.png" },
  { key: "limousine", name: "Limousine", image: "/vehicle-categories/Limousine.png" },
  { key: "commercial-fleet", name: "Commercial / Fleet", image: "/vehicle-categories/Commercial-Fleet.png" },
];

export const CUSTOM_VEHICLE_CATEGORY = { key: "custom", name: "Custom Category", image: "" };

const categoriesByKey = new Map([...VEHICLE_CATEGORY_PRESETS, CUSTOM_VEHICLE_CATEGORY].map((category) => [category.key, category]));
const categoriesByName = new Map(VEHICLE_CATEGORY_PRESETS.map((category) => [category.name.toLowerCase(), category]));

export function getVehicleCategory(key) {
  return categoriesByKey.get(key) || CUSTOM_VEHICLE_CATEGORY;
}

export function inferVehicleCategoryKey(name) {
  const normalized = String(name || "").trim().toLowerCase();
  if (normalized === "suv") return "full-size-suv";
  return categoriesByName.get(normalized)?.key || "custom";
}
