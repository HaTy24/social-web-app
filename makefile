PROJECT_NAME := augment-social-frontend
SERVER := weknot

build:
	cp .production.env .env
	yarn install
	yarn build

zip: build
	echo "git: $(shell git branch --show-current) - $(shell git rev-parse HEAD)" | tee dist/version.txt
	echo "build: $(shell date)" | tee -a dist/version.txt
	zip -r ${PROJECT_NAME}.zip dist

publish: zip
	scp ${PROJECT_NAME}.zip ${SERVER}:projects/archive
	ssh ${SERVER} 'unzip -o projects/archive/${PROJECT_NAME}.zip -d projects/${PROJECT_NAME}'
