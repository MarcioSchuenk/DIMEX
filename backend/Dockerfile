FROM node:lastest

WORKDIR /api

COPY . .

RUN rm -rf node_modules
RUN npm i

CMD ["npm", "start"]

EXPOSE 7766
