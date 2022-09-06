# React Frontend를 Nginx의 static 파일로 모은다.
# The first stage
# Build React static files
FROM node:14.17.2-alpine as build
ARG GIT_TOKEN
ENV NPM_TOKEN=$GIT_TOKEN
RUN npm install yarn
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY apps/Main/package.json ./
COPY apps/Main/ ./
# COPY yarn.lock ./
RUN echo @vntgcorp:registry=https://npm.pkg.github.com/ > ./.npmrc
RUN echo //npm.pkg.github.com/:_authToken=$GIT_TOKEN >> ./.npmrc
RUN echo "always-auth=true" >> .npmrc
RUN yarn install
RUN yarn run make-config
# RUN npm ci --slient

RUN yarn run build

# The second stage
# Copy React static files and start nginx
FROM nginx:1.18
RUN rm -rf /etc/nginx/conf.d
COPY docker/production/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
