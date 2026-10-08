/** Skeleton shown while a shop route streams in. */
export default function Loading() {
  return (
    <div className="container" aria-busy="true" aria-label="Loading products">
      <span className="skeleton" style={{ width: 180, height: 14, marginTop: 20 }} />
      <span className="skeleton" style={{ width: "min(420px, 80%)", height: 40, margin: "16px 0 32px" }} />
      <div className="grid-products">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} style={{ display: "grid", gap: 10 }}>
            <span className="skeleton" style={{ aspectRatio: "1", borderRadius: 16 }} />
            <span className="skeleton" style={{ width: "70%", height: 16 }} />
            <span className="skeleton" style={{ width: "40%", height: 14 }} />
            <span className="skeleton" style={{ height: 38 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
