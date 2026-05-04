import AppShell from "@/components/layout/AppShell";
import RegistrationForm from "@/components/forms/RegistrationForm";

export default function RegisterMerchantPage() {
  return (
    <AppShell title="Register Your Merchant Business" subtitle="Storefronts, pop-ups, food halls, and event-area retail." badges={["Demo"]}>
      <RegistrationForm
        type="merchant"
        title="Merchant / Retail Registration"
        packageCategoryFilter={["merchant"]}
        fields={[
          { name: "businessName", label: "Business name", type: "text", required: true },
          { name: "category", label: "Category", type: "text" },
          { name: "address", label: "Address", type: "text", required: true },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "phone", label: "Phone", type: "tel" },
          { name: "popup", label: "Pop-up activation", type: "checkbox" },
          { name: "specialOffer", label: "Offer for fans", type: "textarea" },
          { name: "zone", label: "Closest event zone", type: "select" },
          { name: "packageId", label: "Selected package", type: "select" },
          { name: "wantsQR", label: "QR offer activation", type: "checkbox" },
          { name: "notes", label: "Notes", type: "textarea" },
        ]}
      />
    </AppShell>
  );
}
