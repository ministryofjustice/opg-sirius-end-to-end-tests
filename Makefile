SHELL = '/bin/bash'
export DOCKER_BUILDKIT ?= 1

build:
	docker-compose build cypress

scan:
	trivy image sirius/end-to-end-tests:latest

unpack-sirius-components:
	docker image pull 311462405659.dkr.ecr.eu-west-1.amazonaws.com/sirius/build-artifacts:v6.77.0-SW-5434.1
	docker run --rm -d -i --name build-artifacts 311462405659.dkr.ecr.eu-west-1.amazonaws.com/sirius/build-artifacts:v6.77.0-SW-5434.1
	docker cp build-artifacts:/artifacts .
	docker stop build-artifacts

pull-sirius-containers:
	cd artifacts && docker-compose pull --include-deps frontend-proxy

start-sirius:
	cd artifacts && make import-fixtures

local-end-to-end-tests:
	mkdir -p -m777 artifacts/end-to-end-results/logs
	mkdir -p -m777 artifacts/end-to-end-results/screenshots
	mkdir -p -m777 artifacts/test-results
	cd artifacts && END_TO_END_IMAGE=sirius/end-to-end-tests:latest docker-compose run end-to-end-tests

stop-sirius:
	cd artifacts && docker-compose down

dev:
	docker run --rm -e CYPRESS_BASE_URL="https://dev.sirius.opg.digital" sirius/end-to-end-tests:latest
