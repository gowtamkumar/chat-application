ARG DEFAULT_PORT=4400
### Stage 1 ###
FROM node:22.14.0-alpine

WORKDIR /app

COPY package.json ./

RUN npm install
# RUN npm run build

COPY . .

ENV PORT $DEFAULT_PORT

EXPOSE $PORT

CMD [ "npm", "run", "start" ]