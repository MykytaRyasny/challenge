# Challenge

## Services

- ### csv-importer

  NestJS framework with postgresql(database conexion is not set-up yet)

- ### query-api

  FastApi framework with postgresql for query (database conexion is not set-up
  yet)

- ### db

  The db we are using is PostgreSQL version 15

## Requirements:

- Docker desktop / Docker, Docker Compose

## How to start the project

1. Clone the repository
2. Navigate to the root folder of the project (challenge)
3. Start all the services `docker compose up --build`:
   - csv-importer: http://localhost:3000
   - query-api: http://localhost:8000
   - PostgreSQL: localhost:5432 (user: postgres, password: postgres, db:
     importer)
4. Stop all the services `docker compose down`

### Current State

- Scaffold of both services and empty database
- Projects are running in dev (watch) mode
- This is the initial setup
