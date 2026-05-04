import AppShell from "@/components/layout/AppShell";
import RegistrationForm from "@/components/forms/RegistrationForm";

export default function RegisterDriverPage() {
  return (
    <AppShell title="Register as a Driver / Transportation" subtitle="Independent drivers and shuttle operators." badges={["Independent", "Not affiliated with rideshare brands"]}>
      <p className="disclaimer-bar mb-4">Not affiliated with Uber, Lyft, or other rideshare brands.</p>
      <RegistrationForm
        type="driver"
        title="Driver / Transportation Registration"
        packageCategoryFilter={["driver"]}
        fields={[
          { name: "operatorName", label: "Operator / business name", type: "text", required: true },
          { name: "vehicleType", label: "Vehicle type (sedan, SUV, shuttle, van)", type: "text" },
          { name: "capacity", label: "Capacity", type: "number" },
          { name: "phone", label: "Phone", type: "tel", required: true },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "license", label: "Operating license #", type: "text" },
          { name: "insurance", label: "Insurance carrier", type: "text" },
          { name: "zone", label: "Primary pickup zone", type: "select" },
          { name: "packageId", label: "Selected package", type: "select" },
          { name: "ackIndependent", label: "I confirm I am an independent operator", type: "checkbox", required: true },
          { name: "notes", label: "Notes", type: "textarea" },
        ]}
      />
    </AppShell>
  );
}
