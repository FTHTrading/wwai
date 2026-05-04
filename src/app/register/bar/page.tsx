import AppShell from "@/components/layout/AppShell";
import RegistrationForm from "@/components/forms/RegistrationForm";

export default function RegisterBarPage() {
  return (
    <AppShell title="Register Your Bar / Nightlife" subtitle="Independent business directory. Age-restricted entries labeled." badges={["21+ where applicable"]}>
      <p className="disclaimer-bar mb-4">Not for use by minors. Verify local age and licensing requirements.</p>
      <RegistrationForm
        type="bar"
        title="Bar / Nightlife Registration"
        packageCategoryFilter={["merchant"]}
        fields={[
          { name: "businessName", label: "Business name", type: "text", required: true },
          { name: "barType", label: "Type (sports bar, lounge, club, brewery)", type: "text" },
          { name: "address", label: "Address", type: "text", required: true },
          { name: "phone", label: "Phone", type: "tel" },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "ageMin", label: "Age minimum", type: "number" },
          { name: "openLate", label: "Open late", type: "checkbox" },
          { name: "specialOffer", label: "Special offer", type: "textarea" },
          { name: "zone", label: "Closest event zone", type: "select" },
          { name: "packageId", label: "Selected package", type: "select" },
          { name: "ackAge", label: "I confirm age-restricted compliance", type: "checkbox", required: true },
          { name: "notes", label: "Notes", type: "textarea" },
        ]}
      />
    </AppShell>
  );
}
