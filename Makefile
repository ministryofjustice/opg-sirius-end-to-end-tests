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
