# Challenge

## Services

- **csv-importer**: NestJS framework with PostgreSQL (database connection is not set up yet)
- **query-api**: FastAPI framework with PostgreSQL for query (database connection is not set up yet)
- **db**: PostgreSQL version 15

## Requirements

- Docker Desktop / Docker, Docker Compose
- Make (only for Linux, WSL, or macOS)

## How to start the project (Windows / macOS / Linux / WSL)

1. Clone the repository
2. Navigate to the root folder of the project (`challenge`)
3. Start all the services:
   ```zsh
   docker compose up --build
   ```
   - csv-importer: http://localhost:3000
   - query-api: http://localhost:8000
   - PostgreSQL: localhost:5432 (user: postgres, password: postgres, db: importer)
4. Stop all the services:
   ```zsh
   docker compose down
   ```

## How to use the Makefile (macOS / Linux / WSL, or Windows with WSL/Git Bash)

The Makefile provides shortcuts for common tasks.
**Note:** On Windows, use WSL or Git Bash to run Makefile commands.

- Install all dependencies for both services:
  ```zsh
  make install-deps
  ```
- Start all services:
  ```zsh
  make start
  ```
- Stop all services:
  ```zsh
  make stop
  ```
- Run tests:
  ```zsh
  make test-csv-importer
  make test-query-api
  ```
- Run linters:
  ```zsh
  make lint-csv-importer
  make lint-query-api
  ```

## Current State

- Scaffold of both services and empty database
- Scaffold of tests for both projects
- Projects are running in dev (watch) mode
- This is the initial setup
