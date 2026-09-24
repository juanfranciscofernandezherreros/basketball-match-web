export function MatchListSkeleton() {
  return (
    <div className="skeleton-card" aria-label="Cargando partidos">
      <div className="skeleton skeleton--title" />
      {Array.from({ length: 5 }, (_, index) => (
        <div className="skeleton-match" key={index}>
          <div className="skeleton skeleton--time" />
          <div className="skeleton skeleton--team" />
          <div className="skeleton skeleton--score" />
        </div>
      ))}
    </div>
  );
}
