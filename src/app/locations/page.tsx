import { LocationsTable } from "@/components/dashboard/locations-table";
import { LOCATIONS } from "@/lib/mock-data";

export default function LocationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Locations</h1>
        <p className="text-sm text-muted-foreground">
          {LOCATIONS.length} fictional locations · click any row for a per-location detail view.
        </p>
      </div>
      <LocationsTable />
    </div>
  );
}
