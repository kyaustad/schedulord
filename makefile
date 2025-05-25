.PHONY: db-generate db-migrate db-setup db-studio db-reset help

help:
	@echo "Available commands:"
	@echo "  make db-setup     - First time setup: generates and applies all migrations"
	@echo "  make db-generate  - Generate new migrations based on schema changes"
	@echo "  make db-migrate   - Apply pending migrations to the database"
	@echo "  make db-studio    - Open Drizzle Studio to view/edit data (if installed)"
	@echo "  make db-reset     - Reset database by dropping all tables and types"

generate:
	@echo "Generating database migrations..."
	npx drizzle-kit generate

migrate:
	@echo "Applying database migrations..."
	npx drizzle-kit migrate

setup:
	@echo "Setting up database for first time use..."
	@echo "Generating migrations..."
	npx drizzle-kit generate
	@echo "Applying migrations..."
	npx drizzle-kit migrate
	@echo "Database setup complete!"

db-studio:
	@echo "Opening Drizzle Studio..."
	npx drizzle-kit studio

db-reset:
	@echo "Resetting database..."
	export $(grep DATABASE_URL .env | xargs)
	@psql $(DATABASE_URL) -f ./src/db/reset.sql
	@echo "Database reset complete!"
