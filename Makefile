.PHONY: init up down build

init:
	echo "Initializing project..."

up:
	docker-compose up --build

down:
	docker-compose down

build:
	docker-compose build