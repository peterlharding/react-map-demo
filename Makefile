


HOST   := $(shell grep "^HOST=" .env 2>/dev/null | sed 's/.*=//')
PORT   := $(shell grep "^PORT=" .env 2>/dev/null | sed 's/.*=//')

.PHONY: chk-env setup install dev build preview check lint typecheck test


# ----------------------------------------------------------------------------

chk-env:
	@ echo "HOST: $(HOST)"
	@ echo "PORT: $(PORT)"

# Initialize sensitive files from their templates, never overwriting existing ones
setup: .env

.env:
	cp setup/env.template .env
	@ echo "Created .env from setup/env.template - set MAPS_API_KEY"


# ----------------------------------------------------------------------------

install:
	npm install

dev:
	npm run dev

build:
	npm run build

preview:
	npm run preview


# ----------------------------------------------------------------------------

check: lint typecheck test

lint:
	npm run lint

typecheck:
	npm run typecheck

test:
	npm test


# ----------------------------------------------------------------------------
