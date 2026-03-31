SHELL = '/bin/bash'
export DOCKER_BUILDKIT ?= 1
export BUILD_TAG ?= latest

all: build dev

build:
	docker compose build cypress
	cd playwright && docker compose build playwright

dev:
	docker compose run --rm cypress

dev-parallel:
	docker compose run --rm cypress parallel

cypress-single:
	docker compose run --rm cypress test -- --spec cypress/e2e/$(SPEC)

lint:
	cd playwright && docker compose run --rm playwright npm run lint

check-format:
	cd playwright && docker compose run --rm playwright npm run check-format

format:
	cd playwright && docker compose run --rm playwright npm run format

run-playwright:
	cd playwright && docker compose run --rm playwright npx playwright test

run-playwright-ui:
	cd playwright && docker compose run -p 9525:9525 --rm playwright npx playwright test --ui --ui-host=0.0.0.0 --ui-port=9525

view-playwright-report:
	cd playwright && docker compose run --rm -p 9323:9323 playwright npx playwright show-report --host 0.0.0.0
