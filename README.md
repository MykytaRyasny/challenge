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
- Make (only for Linux, WSL or MacOS)

## How to start the project (Windows / MacOS / Linux / WSL)

1. Clone the repository
2. Navigate to the root folder of the project (challenge)
3. Start all the services `docker compose up --build`:
   - csv-importer: http://localhost:3000
   - query-api: http://localhost:8000
   - PostgreSQL: localhost:5432 (user: postgres, password: postgres, db:
     importer)
4. Stop all the services `docker compose down`

## How to start project (MacOS / Linux / WSL)

In this OS you can use Makefile which is simple way to put everything together

1. Clone the repository
2. Use commands inside _Makefile_, some examples:
   - `make start`
   - `make stop`

### Current State

- Scaffold of both services and empty database
- Scaffold of tests for both projects
- Projects are running in dev (watch) mode
- This is the initial setup

## 🚀 Performance Profiling (First Stage)

Below are the results of profiling the image size and basic runtime stats for both services using Alpine and Slim images. Each image name describes its content.

---

### 🟦 csv-importer

**Image Size Comparison:**

<p align="left">
  <img src="images/csv-importer-images.png" alt="csv-importer images" width="500"/>
</p>

**ApacheBench (ab) Results:**

<table>
  <tr>
    <td align="center"><b>Alpine</b></td>
    <td align="center"><b>Slim</b></td>
  </tr>
  <tr>
    <td><img src="images/csv-importer-ab-alpine.png" alt="csv-importer ab alpine" width="350"/></td>
    <td><img src="images/csv-importer-ab-slim.png" alt="csv-importer ab slim" width="350"/></td>
  </tr>
</table>

**Docker Stats:**

<table>
  <tr>
    <td align="center"><b>Alpine</b></td>
    <td align="center"><b>Slim</b></td>
  </tr>
  <tr>
    <td><img src="images/docker-stats-alpine.png" alt="docker stats alpine" width="350"/></td>
    <td><img src="images/docker-stats-slim.png" alt="docker stats slim" width="350"/></td>
  </tr>
</table>

---

### 🟩 query-api

**Image Size Comparison:**

<p align="left">
  <img src="images/query-api-images.png" alt="query-api images" width="500"/>
</p>

**ApacheBench (ab) Results:**

<table>
  <tr>
    <td align="center"><b>Alpine</b></td>
    <td align="center"><b>Slim</b></td>
  </tr>
  <tr>
    <td><img src="images/query-api-ab-alpine.png" alt="query-api ab alpine" width="350"/></td>
    <td><img src="images/query-api-ab-slim.png" alt="query-api ab slim" width="350"/></td>
  </tr>
</table>

---

<sub>These results provide a visual comparison of image sizes and basic performance between Alpine and Slim base images for both services.</sub>
