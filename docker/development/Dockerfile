# React Frontend를 Nginx의 static 파일로 모은다.
# The first stage
# Build React static files
FROM node:14.17.2-alpine as build

RUN npm install yarn
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY src/package.json ./
COPY src/yarn.lock ./
RUN yarn install
# RUN npm ci --slient

COPY src/ ./
RUN yarn run build

# The second stage
# Copy React static files and start nginx
FROM nginx:1.18
RUN rm -rf /etc/nginx/conf.d
COPY docker/development/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
