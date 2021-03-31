.PHONY: build clean lint demos

demos: build
	npx http-server

build: node_modules/
	npx rollup --config rollup/es.config.js

lint: node_modules/
	npm run lint

clean:
	-rm -f package-lock.json
	-rm -r ./node_modules
	-npm cache verify
	-rm -r dist/*

node_modules/: package.json
	npm install
	touch node_modules/
