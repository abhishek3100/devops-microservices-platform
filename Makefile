.PHONY: run-user run-task run-notification run-gateway up down build clean

# Run individual services

run-user:
	cd services/user-service && node src/index.js

run-task:
	cd services/task-service && python -m src.server

run-notification:
	cd services/notification-service && python -m src.server

run-gateway:
	cd services/api-gateway && node src/index.js


# Run all services (manual mode)
run-all:
	@echo "Start services in separate terminals using:"
	@echo "make run-user"
	@echo "make run-task"
	@echo "make run-notification"
	@echo "make run-gateway"


# Docker (Phase 2 ready)
up:
	docker-compose up --build

down:
	docker-compose down

build:
	docker-compose build


# Cleanup
clean:
	find . -name "__pycache__" -type d -exec rm -rf {} +
	find . -name "*.pyc" -delete