export function Header() {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <div className="brand">
          <span className="brand__mark">B</span>
          <div>
            <strong>Basketball Match</strong>
            <small>Resultados y estadísticas</small>
          </div>
        </div>
        <nav className="topbar__nav" aria-label="Navegación principal">
          <span className="topbar__nav-item topbar__nav-item--active">Partidos</span>
        </nav>
      </div>
    </header>
  );
}
