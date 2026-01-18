#https://docs.docker.com/dhi/migration/examples/node/
FROM node:18-alpine

WORKDIR /app

COPY package.json .
RUN npm install --only=production

COPY index.js .

EXPOSE 8080

CMD ["node", "index.js"]
