.PHONY: run-user run-task run-notification run-gateway up down build k8s-up k8s-down prometheus-install  gateway-install clean 

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
	docker-compose -f infra/compose/docker-compose.yaml up --build

down:
	docker-compose -f infra/compose/docker-compose.yaml down

build:
	docker-compose -f infra/compose/docker-compose.yaml build

k8s-up:
	kubectl apply -k k8s/overlays/local

k8s-down:
	kubectl delete -k k8s/overlays/local

prometheus-install:
	helm upgrade --install prometheus prometheus-community/prometheus \
		-n monitoring \
		--create-namespace \
		-f k8s/base/monitoring/prometheus/values.yaml

gateway-install:
	helm upgrade --install eg oci://docker.io/envoyproxy/gateway-helm \
		--version v1.9.1 \
		-n envoy-gateway-system \
		--create-namespace

# Cleanup
clean:
	find . -name "__pycache__" -type d -exec rm -rf {} +
	find . -name "*.pyc" -delete