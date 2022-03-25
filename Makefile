SHELL = '/bin/bash'
export DOCKER_BUILDKIT ?= 1

all: build scan local-run

build:
	docker-compose build cypress

scan:
	trivy image sirius/end-to-end-tests:latest

unpack-sirius-components:
	docker image pull 311462405659.dkr.ecr.eu-west-1.amazonaws.com/sirius/build-artifacts:latest
	docker run --rm -d -i --name build-artifacts 311462405659.dkr.ecr.eu-west-1.amazonaws.com/sirius/build-artifacts:latest
	docker cp build-artifacts:/artifacts .
	docker kill build-artifacts

pull-sirius-containers:
	cd artifacts && docker-compose pull --quiet --include-deps frontend-proxy

start-sirius:
	cd artifacts && make import-fixtures
	cd artifacts && docker-compose stop queue

local-end-to-end-tests:
	mkdir -p -m777 artifacts/end-to-end-results/logs
	mkdir -p -m777 artifacts/end-to-end-results/screenshots
	mkdir -p -m777 artifacts/end-to-end-results/test-results
	cd artifacts && END_TO_END_IMAGE=sirius/end-to-end-tests:latest docker-compose run end-to-end-tests

stop-sirius:
	cd artifacts && docker-compose down

local-run: unpack-sirius-components pull-sirius-containers start-sirius local-end-to-end-tests stop-sirius

dev:
	docker run --rm -e CYPRESS_BASE_URL="https://dev.sirius.opg.digital" sirius/end-to-end-tests:latest
