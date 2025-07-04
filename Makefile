.PHONY: start stop test coverage lint install test-csv-importer test-query-api lint-csv-importer lint-query-api clean

start:
	docker compose up --build

stop:
	docker compose down

test:
	cd csv-importer && npm run test
	cd query-api && pytest

coverage:
	cd csv-importer && npm run test:cov
	cd query-api && pytest --cov=app

lint:
	cd csv-importer && npm run lint
	cd query-api && flake8 app/ tests/

install:
	cd csv-importer && npm install
	cd query-api && pip install -r requirements.txt

test-csv-importer:
	cd csv-importer && npm run test

test-query-api:
	cd query-api && pytest

lint-csv-importer:
	cd csv-importer && npm run lint

lint-query-api:
	cd query-api && flake8 app/ tests/

clean:
	docker compose down --volumes --rmi all --remove-orphans
	docker system prune -af