import dynamic from "next/dynamic";
import { CatchmentMapPicker } from "@/components/catchment-map-picker";

export default function CatchmentMapPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Catchment Map</h1>
        <p className="text-sm text-muted-foreground">
          Where leads are coming from — pick a location to see the top ZIP codes within its catchment area, sized by lead
          volume (mock data). In production, point this at your real geo analytics source.
        </p>
      </div>
      <CatchmentMapPicker />
    </div>
  );
}
