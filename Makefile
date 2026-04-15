SHELL = '/bin/bash'
include Makefile.dev.mk
export DOCKER_BUILDKIT ?= 1
export BUILD_TAG ?= latest

ifeq ($(CI),1)
	DOCKER_FEATURE_FILES=-f docker-compose.yml
else ifeq ($(CI),true)
	DOCKER_FEATURE_FILES=-f docker-compose.yml
else
	DOCKER_FEATURE_FILES=-f docker-compose.yml -f docker-compose.override.yml
endif

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
	cd playwright && docker compose $(DOCKER_FEATURE_FILES) run --rm playwright npm run lint

check-format:
	cd playwright && docker compose $(DOCKER_FEATURE_FILES) run --rm playwright npm run check-format

run-playwright:
	cd playwright && docker compose $(DOCKER_FEATURE_FILES) run --rm playwright npx playwright test
