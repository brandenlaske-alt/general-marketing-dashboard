import { UtmBuilderForm } from "@/components/utm-builder-form";

export default function UtmBuilderPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">UTM Builder</h1>
        <p className="text-sm text-muted-foreground">
          Tag a destination URL with UTM parameters. Everything happens in the browser — nothing is stored.
        </p>
      </div>
      <UtmBuilderForm />
    </div>
  );
}
