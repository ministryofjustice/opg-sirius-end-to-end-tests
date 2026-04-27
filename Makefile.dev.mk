# This Makefile holds all commands that are not executed as part of the CI Process on Jenkins
default: help

help: ## The help text you're reading
	@grep --no-filename -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

format: ## Format Playwright test code
	cd playwright && docker compose -f docker-compose.yml -f docker-compose.override.yml run --rm playwright format

run-playwright-ui: ## Start container so Playwright tests can be run through the browser on http://localhost:9525
	cd playwright && docker compose -f docker-compose.yml -f docker-compose.override.yml run -p 9525:9525 --rm playwright ui

show-playwright-report: ## Start server to view Playwright test report on http://localhost:9323
	cd playwright && docker compose -f docker-compose.yml -f docker-compose.override.yml run --rm -p 9323:9323 playwright show-report
