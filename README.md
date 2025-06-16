# LSAT Practice Progress Checker

This repository contains a simple in-memory LSAT practice tracker. The backend is a Spring Boot service and the frontend is a minimal React app.

## Frontend
Open `frontend/index.html` in your browser. It loads React via CDN and uses Bootstrap for styling while interacting with the backend APIs.

## Backend
Run the Spring Boot application:

```bash
cd backend
mvn spring-boot:run
```

The server exposes the following endpoints:
- `POST /api/scores` – add a score entry `{ "user": "Alice", "date": "2023-09-01", "score": 160 }`
- `GET /api/scores/{user}` – list scores for a user
- `GET /api/metrics/{user}` – returns metrics such as average, standard deviation and best score

All data is stored in memory and resets when the server restarts.
