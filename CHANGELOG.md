# Changelog

## 0.2.0 - 2026-09-24

- Añade navegación desde cada fila a `/matches/{matchId}`.
- Consume `GET /api/v1/matches/{matchId}` una sola vez para obtener toda la información del partido.
- Muestra marcador, parciales, team stats, jugadores y point-by-point completo en una única página.
- Añade React Router.
- Añade tests del contrato de detalle completo.

## 0.2.0 - 2026-09-24

- Hace navegable cada partido a `/matches/{matchId}`.
- Carga todo el detalle del partido mediante una única petición a `GET /api/v1/matches/{matchId}`.
- Muestra marcador, parciales, summary, estadísticas de equipo, jugadores y point-by-point completo.
- Añade React Router y layout responsive de detalle.

## 0.1.0 - 2026-09-24

- Crea el frontend React + TypeScript con Vite.
- Carga por defecto todos los partidos desde el endpoint paginado de `basketball-match-api`.
- Agrupa visualmente los partidos por país y competición.
- Añade diseño compacto inspirado en aplicaciones de resultados deportivos como Flashscore.
- Añade estados de carga, error, vacío y reintento.
- Añade paginación responsive.
- Añade tests, CI y Docker con Nginx.
