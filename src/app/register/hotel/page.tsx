import AppShell from "@/components/layout/AppShell";
import RegistrationForm from "@/components/forms/RegistrationForm";

export default function RegisterHotelPage() {
  return (
    <AppShell title="Register Your Hotel" subtitle="Verified hotel network with route packages and concierge integration." badges={["Demo"]}>
      <RegistrationForm
        type="hotel"
        title="Hotel Registration"
        packageCategoryFilter={["hotel"]}
        fields={[
          { name: "businessName", label: "Hotel name", type: "text", required: true },
          { name: "brand", label: "Brand / chain", type: "text" },
          { name: "address", label: "Address", type: "text", required: true },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "phone", label: "Phone", type: "tel" },
          { name: "rooms", label: "Total rooms", type: "number" },
          { name: "shuttle", label: "Operates shuttle", type: "checkbox" },
          { name: "concierge", label: "Has concierge desk", type: "checkbox" },
          { name: "zone", label: "Closest event zone", type: "select" },
          { name: "packageId", label: "Selected package", type: "select" },
          { name: "wantsRoute", label: "Add to hotel→seat routing", type: "checkbox" },
          { name: "wantsConcierge", label: "WWAI concierge integration", type: "checkbox" },
          { name: "notes", label: "Notes", type: "textarea" },
        ]}
      />
    </AppShell>
  );
}
