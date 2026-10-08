import { showPlaceholderMarkers } from "@/lib/site";

/** Marks copy that must be verified before launch (claims, prices, certifications). */
export function Placeholder({ children, note = "To be confirmed" }: { children: React.ReactNode; note?: string }) {
  if (!showPlaceholderMarkers) return <>{children}</>;
  return (
    <span title={`Placeholder: ${note}`}>
      {children}
      <span className="ph-tag">
        TBC<span className="visually-hidden"> — placeholder, {note}</span>
      </span>
    </span>
  );
}
