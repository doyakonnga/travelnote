FROM node:20-alpine
# https://github.com/yarnpkg/yarn/issues/9005

WORKDIR /app
COPY package.json .
RUN npm i 
COPY . .

CMD ["npm", "run", "dev"] 