export default function Loading() {
  return (
    <div className="container" aria-busy="true" aria-label="Loading product" style={{ display: "grid", gap: 32, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", paddingTop: 40 }}>
      <span className="skeleton" style={{ aspectRatio: "1", borderRadius: 16 }} />
      <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
        <span className="skeleton" style={{ width: "40%", height: 16 }} />
        <span className="skeleton" style={{ width: "80%", height: 40 }} />
        <span className="skeleton" style={{ width: "30%", height: 28 }} />
        <span className="skeleton" style={{ height: 64 }} />
        <span className="skeleton" style={{ height: 54 }} />
        <span className="skeleton" style={{ height: 120 }} />
      </div>
    </div>
  );
}
