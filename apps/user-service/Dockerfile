FROM node:18 AS deps
WORKDIR /app

COPY package*.json ./
COPY apps/user-service/package*.json ./apps/user-service/
COPY libs/shared/package*.json ./libs/shared/

RUN npm install

FROM node:18 AS build
WORKDIR /app

COPY ./package*.json ./
COPY ./apps/user-service ./apps/user-service
COPY ./libs ./libs

COPY --from=deps /app/node_modules ./node_modules

WORKDIR /app/apps/user-service
RUN npx prisma migrate dev --name init
RUN npx prisma generate

WORKDIR /app
RUN npm run build --workspace=libs/shared

RUN npm run build --workspace=apps/user-service

FROM node:18 AS prod
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/apps/user-service/dist ./dist

COPY --from=build /app/libs ./libs

COPY --from=build /app/apps/user-service/src/database/generated-prisma-client ./dist/src/database/generated-prisma-client


EXPOSE 3000
CMD ["node", "dist/index.js"]
