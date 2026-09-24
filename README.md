# basketball-match-web

Current version: **0.2.0**

Frontend React para visualizar los partidos publicados por `basketball-match-api`.

## Stack

- React 19
- TypeScript
- Vite
- CSS responsive sin framework visual
- Vitest
- Nginx para producción

## Flujo

```text
PostgreSQL
   ↓
basketball-match-projector
   ↓
MongoDB
   ↓
basketball-match-api
   ↓
basketball-match-web
```

## Pantalla inicial

La aplicación carga por defecto:

```http
GET /api/v1/matches?page=0&size=20&sort=projectedAt,desc
```

La vista está inspirada en el patrón visual de aplicaciones de resultados deportivos como Flashscore: cabecera oscura, acento rojo, competiciones agrupadas y filas compactas de marcador.

No se replica el diseño exacto ni activos de terceros.

La pantalla incluye:

- total de partidos;
- agrupación por país y competición;
- equipo local y visitante;
- marcador;
- fecha/hora;
- estado finalizado o programado;
- número de eventos point-by-point disponibles;
- estados de carga, error y vacío;
- paginación anterior/siguiente;
- diseño responsive para móvil.

El point-by-point completo no se carga en la lista para mantener ligera la respuesta.

## Desarrollo local

Arranca primero `basketball-match-api` en el puerto 8080.

Después:

```bash
npm install
npm run dev
```

Vite sirve el frontend en `http://localhost:5173` y redirige las llamadas `/api` a `http://localhost:8080`, evitando problemas CORS durante desarrollo.

## Configuración

Por defecto la aplicación usa llamadas same-origin:

```text
VITE_API_URL=
```

Si frontend y API se publican en hosts diferentes:

```text
VITE_API_URL=https://api.example.com
```

En ese caso la API debe permitir el origen del frontend mediante CORS.

## Verificación

```bash
npm run typecheck
npm test
npm run build
```

## Docker

```bash
docker build --build-arg VITE_API_URL=https://api.example.com -t basketball-match-web .
docker run --rm -p 8081:80 basketball-match-web
```

## Detalle completo del partido

Cada fila de la lista abre:

```text
/matches/{matchId}
```

La vista realiza una única petición:

```http
GET /api/v1/matches/{matchId}
```

La respuesta contiene directamente toda la información necesaria: documento principal, marcador, parciales, summary, estadísticas de equipo, jugadores y point-by-point agrupado por cuarto. El frontend no necesita coordinar varias llamadas para componer el partido.
