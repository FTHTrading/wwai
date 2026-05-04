import AppShell from "@/components/layout/AppShell";
import RegistrationForm from "@/components/forms/RegistrationForm";

export default function RegisterVenuePage() {
  return (
    <AppShell title="Register a Venue" subtitle="Hotels, halls, watch parties, fan-fest spaces, and private experiences." badges={["Demo"]}>
      <RegistrationForm
        type="venue"
        title="Venue Registration"
        fields={[
          { name: "venueName", label: "Venue name", type: "text", required: true },
          { name: "venueType", label: "Type (hall, watch party, fan-fest, private)", type: "text" },
          { name: "address", label: "Address", type: "text", required: true },
          { name: "capacity", label: "Capacity", type: "number" },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "phone", label: "Phone", type: "tel" },
          { name: "zone", label: "Closest event zone", type: "select" },
          { name: "wantsSponsor", label: "Open to sponsor activation", type: "checkbox" },
          { name: "wantsRoute", label: "Add to safety routes", type: "checkbox" },
          { name: "notes", label: "Notes", type: "textarea" },
        ]}
      />
    </AppShell>
  );
}
