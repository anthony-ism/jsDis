ISTANBUL = node --harmony ./node_modules/istanbul/lib/cli.js
NPM_BIN = ./node_modules/.bin
TESTS=$(shell find ${PWD}/test/lib -name '*test.js')

all: clean install test

clean:
	@rm -rf ./node_modules
	@rm -rf ./coverage

install:
	@npm install

test: install
	$(ISTANBUL) cover $(NPM_BIN)/_mocha -dir ./coverage/unit -i "lib/**/*.js"  --include-all-sources -- $(TESTS)


.PHONY: all clean install test