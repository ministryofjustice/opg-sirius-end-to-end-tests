SHELL = '/bin/bash'
export DOCKER_BUILDKIT ?= 1
export BUILD_TAG ?= latest

all: build dev

build:
	docker compose build cypress

dev:
	docker compose run --rm cypress

dev-parallel:
	docker compose run --rm cypress parallel

cypress-single:
	docker compose run --rm cypress test -- --spec cypress/e2e/$(SPEC)

run-playwright:
	cd playwright && docker compose run --rm playwright npx playwright test

view-playwright-report:
	cd playwright && docker compose run --rm -p 9323:9323 playwright npx playwright show-report --host 0.0.0.0
