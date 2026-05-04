import AppShell from "@/components/layout/AppShell";
import RegistrationForm from "@/components/forms/RegistrationForm";

export default function RegisterSponsorPage() {
  return (
    <AppShell title="Sponsor Application" subtitle="Brand sponsor packages — zones, channels, and contract value." badges={["Demo"]}>
      <RegistrationForm
        type="sponsor"
        title="Sponsor Application"
        packageCategoryFilter={["sponsor"]}
        fields={[
          { name: "brandName", label: "Brand name", type: "text", required: true },
          { name: "category", label: "Category", type: "text" },
          { name: "contactName", label: "Primary contact", type: "text", required: true },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "phone", label: "Phone", type: "tel" },
          { name: "budget", label: "Approximate budget (USD)", type: "number" },
          { name: "zone", label: "Target zone", type: "select" },
          { name: "channels", label: "Channels of interest (QR, Map, Concierge, Routes, Social)", type: "textarea" },
          { name: "packageId", label: "Preferred package", type: "select" },
          { name: "notes", label: "Brief / objectives", type: "textarea" },
        ]}
      />
    </AppShell>
  );
}
