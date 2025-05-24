.PHONY: start stop test-csv-importer test-query-api lint-csv-importer lint-query-api install-deps

start:
	docker compose up --build

stop:
	docker compose down

test-csv-importer:
	cd csv-importer && npm run test

test-query-api:
	cd query-api && pytest

lint-csv-importer:
	cd csv-importer && npm run lint

lint-query-api:
	cd query-api && flake8 app/ tests/

install-deps:
	cd csv-importer && npm install
	cd query-api && pip install -r requirements.txt