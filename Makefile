postgres:
	docker run --name todo_app -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=pass -d postgres:15-alpine

createdb:
	docker exec -it todo_app createdb --username=root --owner=root todo_app
	
dropdb:
	docker exec -it todo_app dropdb todo_app

.PHONY: postgres createdb dropdb