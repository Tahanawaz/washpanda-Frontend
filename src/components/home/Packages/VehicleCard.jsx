import VehicleCategoryVisual from "../../common/VehicleCategoryVisual";

export default function VehicleCard({ vehicle }) {
  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-4 text-center">

      <VehicleCategoryVisual vehicle={vehicle} className="mx-auto h-16 w-full" iconClassName="h-12 w-20" />

      <h3 className="mt-3 font-semibold text-gray-800">
        {vehicle.name}
      </h3>

    </div>
  );
}
