ifneq (,$(wildcard ./.env))
	include .env
	export
endif

postgres:
	docker run --name ${CONTAINER_NAME} -p ${DB_PORT}:${CONTAINER_PORT} -e POSTGRES_USER=${DB_USERNAME} -e POSTGRES_PASSWORD=${DB_PASSWORD} -d ${DOCKER_IMAGE}

startcontainer:
	docker start ${CONTAINER_NAME}

createdbdev:
	docker exec -it ${CONTAINER_NAME} createdb --username=${DB_USERNAME} --owner=${DB_USERNAME} ${DB_DATABASE}

dropdbdev:
	docker exec -it ${CONTAINER_NAME} dropdb ${DB_DATABASE} -U ${DB_USERNAME}

createdb:
	pnpm sequelize db:create

dropdb:
	pnpm sequelize db:drop

migrateup:
	pnpm sequelize-cli db:migrate

migratedown:
	pnpm sequelize-cli db:migrate:undo

dev:
	pnpm dev

dbdocs:
	dbdocs build src/doc/db.dbml

.PHONY:
	postgres startcontainer createdb createdbdev dropdb dropdbdev migrateup migratedown dev
