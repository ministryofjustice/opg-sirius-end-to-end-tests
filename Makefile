SHELL = '/bin/bash'
export DOCKER_BUILDKIT ?= 1

build:
	docker-compose build cypress

dev:
	docker run --rm -e CYPRESS_BASE_URL="https://dev.sirius.opg.digital" sirius/end-to-end-tests:latest
