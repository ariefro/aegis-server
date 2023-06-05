FROM node:16 as build
WORKDIR /app

COPY package.json .
RUN npm install

COPY . .
RUN chmod +x start.sh
RUN chmod +x wait-for.sh
RUN npm run build

FROM node:16-alpine
WORKDIR /app

COPY --from=build /app/package*.json .
RUN npm ci --omit=dev
RUN npm install -g sequelize-cli

COPY .env .
COPY .sequelizerc .
COPY src/migrations /app/src/migrations
COPY /src/configs/sequelize /app/src/configs/sequelize
COPY --from=build /app/start.sh .
COPY --from=build /app/wait-for.sh .
COPY --from=build /app/dist ./dist

EXPOSE 8080
CMD ./start.sh
