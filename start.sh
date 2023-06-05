#!/bin/sh

echo "run db migration..."
# source /app/.env
# sequelize-cli db:migrate --env stage

if [ $NODE_ENV == "stage" ]
    then sequelize-cli db:migrate --env stage
    else sequelize-cli db:migrate --env development
fi

echo "app start..."
node /app/dist