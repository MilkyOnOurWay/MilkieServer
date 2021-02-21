FROM node:fermium-alpine

COPY . .

RUN npm install --production

EXPOSE 3000

USER daemon

CMD ["node", "bin/www"]
