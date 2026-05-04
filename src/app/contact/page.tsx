import AppShell from "@/components/layout/AppShell";
import ContactForm from "@/components/forms/ContactForm";

export default function ContactPage() {
  return (
    <AppShell
      title="Contact Sales"
      subtitle="Tell us about your event city, your sponsor pipeline, your hotel network, or your driver fleet — we'll get back."
      badges={["Demo capture"]}
    >
      <div className="grid lg:grid-cols-[1fr_360px] gap-5">
        <ContactForm />
        <aside className="wwai-panel p-5 h-fit">
          <h3 className="font-bold text-white">What happens next</h3>
          <ol className="text-sm text-slate-300 mt-3 space-y-2 list-decimal pl-4">
            <li>Lead saved to local pipeline.</li>
            <li>Sales agent reviews intent and routes to a sponsor / merchant / hotel / driver flow.</li>
            <li>Proposal is built with packages and add-ons matched to the use case.</li>
            <li>WWAI demo, safety route demo, and admin walkthrough scheduled.</li>
          </ol>
        </aside>
      </div>
    </AppShell>
  );
}
