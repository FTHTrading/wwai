export default function DemoWarning({ message }: { message?: string }) {
  return (
    <div className="border border-amber-500/40 bg-amber-500/5 rounded-xl p-3 mb-5 text-xs text-amber-200">
      <span className="font-bold uppercase tracking-widest text-amber-300">Controlled demo.</span>{" "}
      {message ?? "Do not enter real customer payment, personal, or safety-critical data."}
    </div>
  );
}
