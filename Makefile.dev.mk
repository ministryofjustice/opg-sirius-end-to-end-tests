# This Makefile holds all commands that are not executed as part of the CI Process on Jenkins
default: help

help: ## The help text you're reading
	@grep --no-filename -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

format:
	cd playwright && docker compose run --rm playwright format

run-playwright-ui:
	cd playwright && docker compose run -p 9525:9525 --rm playwright ui

show-playwright-report:
	cd playwright && docker compose run --rm -p 9323:9323 playwright show-report
