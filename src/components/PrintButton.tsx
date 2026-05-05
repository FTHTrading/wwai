"use client";

export default function PrintButton({ className = "wwai-btn-primary text-sm" }: { className?: string }) {
  return (
    <button onClick={() => window.print()} className={className}>
      Print / Save PDF
    </button>
  );
}
