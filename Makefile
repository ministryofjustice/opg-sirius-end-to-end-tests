SHELL = '/bin/bash'
export DOCKER_BUILDKIT ?= 1
export BUILD_TAG ?= latest

all: build scan dev

build:
	docker compose build cypress

scan:
	trivy image 311462405659.dkr.ecr.eu-west-1.amazonaws.com/sirius/end-to-end-tests:latest

dev:
	docker compose run --rm cypress

dev-parallel:
	docker compose run --rm cypress parallel
