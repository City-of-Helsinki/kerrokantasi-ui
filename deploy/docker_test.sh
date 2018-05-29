#!/usr/bin/env bash

if [ "$TRAVIS_NODE_VERSION" == "lts/*" ]; then
	echo "Do docker testing"
	docker build -t kerrokantasi-ui .
	docker run --rm kerrokantasi-ui /bin/bash -c "npm run lint"
	docker run --rm kerrokantasi-ui /bin/bash -c "npm run test:cov"
fi
