FROM node:18
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
ARG DATABASE_URL
RUN npm install
RUN npx prisma migrate dev --name init_dev
COPY . .
EXPOSE 3000
CMD ["npx", "ts-node", "index.ts"]
