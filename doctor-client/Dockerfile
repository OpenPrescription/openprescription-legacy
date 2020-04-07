FROM node:12.16-alpine

RUN mkdir -p /home/node/openprescription/doctor-client/node_modules && chown -R node:node /home/node/openprescription/doctor-client

WORKDIR /home/node/openprescription/doctor-client

COPY package*.json ./

RUN npm install --silent
RUN npm install react-scripts@3.0.1 -g --silent
RUN npm install concurrently -g --silent
RUN npm install nodemon -g --silent

COPY . .

COPY --chown=node:node . .

USER node

CMD [ "npm", "start" ]