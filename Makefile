SHELL = '/bin/bash'
export DOCKER_BUILDKIT ?= 1
export BUILD_TAG ?= latest

all: build scan local-run

build:
	docker-compose build cypress

scan:
	trivy image sirius/end-to-end-tests:latest

unpack-sirius-components:
	docker image pull 311462405659.dkr.ecr.eu-west-1.amazonaws.com/sirius/build-artifacts:${BUILD_TAG}
	docker run --rm -d -i --name build-artifacts 311462405659.dkr.ecr.eu-west-1.amazonaws.com/sirius/build-artifacts:${BUILD_TAG}
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
	docker-compose -f docker-compose.ci.yml run cypress

stop-sirius:
	cd artifacts && docker-compose down

local-run: unpack-sirius-components pull-sirius-containers start-sirius local-end-to-end-tests stop-sirius

dev:
	docker run --rm -v "$(PWD)/test-results:/test-results" -e CYPRESS_BASE_URL="https://development.sirius.opg.service.justice.gov.uk/" sirius/end-to-end-tests:latest

dev-parallel:
	docker run --rm -v "$(PWD)/test-results:/test-results" -e CYPRESS_BASE_URL="https://development.sirius.opg.service.justice.gov.uk/" sirius/end-to-end-tests:latest parallel

dev-parallel-generate-weights:
	docker run --rm -v "$(PWD)/test-results:/test-results" -v "$(PWD)/cypress:/home/node/cypress" -e CYPRESS_BASE_URL="https://development.sirius.opg.service.justice.gov.uk/" sirius/end-to-end-tests:latest parallel
