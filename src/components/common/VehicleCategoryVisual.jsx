import { LuImagePlus } from "react-icons/lu";
import { getVehicleCategory, inferVehicleCategoryKey } from "../../constants/vehicleCategories";

export default function VehicleCategoryVisual({ vehicle, className = "h-16 w-full" }) {
  const inferredKey = inferVehicleCategoryKey(vehicle?.name);
  const categoryKey = vehicle?.categoryKey && vehicle.categoryKey !== "custom" ? vehicle.categoryKey : inferredKey;
  const category = getVehicleCategory(categoryKey);

  if (category.key === "custom") {
    return (
      <span className={`flex items-center justify-center overflow-hidden ${className}`}>
        {vehicle?.image ? <img src={vehicle.image} alt={`${vehicle?.name || "Custom vehicle"} category`} loading="lazy" decoding="async" className="h-full w-full object-contain" /> : <LuImagePlus className="h-10 w-10 text-blue-300" />}
      </span>
    );
  }

  return <span className={`flex items-center justify-center overflow-hidden ${className}`}><img src={category.image} alt={`${category.name} category`} loading="lazy" decoding="async" className="h-full w-full object-contain" /></span>;
}
