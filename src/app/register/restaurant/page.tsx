import AppShell from "@/components/layout/AppShell";
import RegistrationForm from "@/components/forms/RegistrationForm";

export default function RegisterRestaurantPage() {
  return (
    <AppShell title="Register Your Restaurant" subtitle="Add your restaurant to the WWAI network." badges={["Demo"]}>
      <RegistrationForm
        type="restaurant"
        title="Restaurant Registration"
        intro="Restaurants get listed in WWAI, can offer QR-based deals, route guests in/out, and integrate with sponsor campaigns."
        packageCategoryFilter={["merchant"]}
        fields={[
          { name: "businessName", label: "Business name", type: "text", required: true },
          { name: "cuisine", label: "Cuisine / type", type: "text", required: true },
          { name: "address", label: "Address", type: "text", required: true },
          { name: "phone", label: "Phone", type: "tel" },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "capacity", label: "Capacity", type: "number" },
          { name: "kidFriendly", label: "Kid-friendly", type: "checkbox" },
          { name: "hours", label: "Hours of operation", type: "textarea" },
          { name: "openLate", label: "Open late (after 10pm)", type: "checkbox" },
          { name: "specialOffer", label: "Special offer for fans", type: "textarea" },
          { name: "zone", label: "Closest event zone", type: "select" },
          { name: "packageId", label: "Selected package", type: "select" },
          { name: "wantsQR", label: "I want a QR offer", type: "checkbox" },
          { name: "wantsRoute", label: "Add me to safety-route stops", type: "checkbox" },
          { name: "wantsConcierge", label: "Integrate with WWAI concierge", type: "checkbox" },
          { name: "notes", label: "Anything else?", type: "textarea" },
        ]}
      />
    </AppShell>
  );
}
