FROM node:alpine as DEP
WORKDIR /root/app/
COPY package.json /root/app/package.json
COPY yarn.lock /root/app/yarn.lock
RUN yarn

FROM node:alpine as HTML
WORKDIR /root/app
COPY --from=DEP /root/app/node_modules/ /root/app/node_modules
COPY src /root/app/src
COPY public /root/app/public
COPY package.json /root/app/package.json
RUN yarn build

FROM openresty/openresty:alpine
ADD conf.d/ /etc/nginx/conf.d/
ADD nginx.conf /etc/nginx/nginx.conf
COPY --from=HTML /root/app/build /usr/share/nginx/html
EXPOSE 80