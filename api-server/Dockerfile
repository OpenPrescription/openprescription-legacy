FROM node:12.16-alpine

RUN mkdir -p /home/node/openprescription/server/node_modules && chown -R node:node /home/node/openprescription/server

WORKDIR /home/node/openprescription/server

COPY package*.json ./
COPY yarn*.lock ./

RUN yarn

COPY . .

COPY --chown=node:node . .

USER node

CMD [ "yarn", "run", "dev" ]