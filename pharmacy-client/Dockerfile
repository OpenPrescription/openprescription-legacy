# build

FROM node:12.16-alpine as build
WORKDIR /home/node/openprescription/pharmacy-client
ENV PATH /home/node/openprescription/pharmacy-client/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm install --silent
RUN npm install react-scripts@3.0.1 -g --silent

COPY . /home/node/openprescription/pharmacy-client

RUN npm run build 

# deploy
FROM nginx:1.17.7
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY /nginx/conf /etc/nginx/conf.d
COPY --from=build /home/node/openprescription/pharmacy-client/build /usr/share/nginx/html
CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'