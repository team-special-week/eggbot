FROM alpine:latest
MAINTAINER ballbot <5252bb@daum.net>

RUN mkdir -p /app/dist
WORKDIR /app
COPY ./ /app

RUN apk add --update nodejs npm
RUN npm ci
RUN npm install -g pm2
RUN npm run build

EXPOSE 3000
ENTRYPOINT ["pm2-runtime", "/app/dist/main.js"]