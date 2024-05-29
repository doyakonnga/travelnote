FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm i --omit-dev
COPY . .
RUN npx prisma generate

CMD ["npm", "run", "start"]