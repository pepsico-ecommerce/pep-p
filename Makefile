.PHONY: build clean lint demos

demos: build
	# npm run start:demo
	npx http-server 

build: node_modules/
	# cp src/styles.css dist/styles.css
	# npx ascjs src esm
	# npx rollup --config rollup/es.config.js
	# npx rollup --config rollup/babel.config.js
	# npx rollup --config rollup/cjs.config.js
	npx rollup --config rollup/es.config.js
	# npx webpack --mode=development

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
