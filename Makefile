.PHONY: all tools help run

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

all: install build run

install: tools

travis: tools lint version

tools: install-webpack install-yarn install-package set-githook


# install
set-dev-config:
	@cp docs/dev/config.json src/js;

set-githook:
	@cd scripts/config/git/ && ./install_git_hooks.sh

install-webpack:
	@if ! command -v webpack &> /dev/null; then npm install -g webpack; fi

install-yarn:
	@if ! command -v yarn &> /dev/null; then npm install -g yarn; fi

install-package:
	@yarn install


# run
build:
	@yarn build

run:
	@yarn start &

watch:
	@yarn watch

dev: run watch

# pre-processing
lint:
	@yarn lint

test:
	@yarn test

publish:
	@npm run build && npm run publish
