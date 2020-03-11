# Build
FROM alpine as build

RUN \
  apk add npm --no-cache && \
  npm i yarn -g && \
  # work directories
  mkdir /code && \
  # node packages
  yarn global add @vue/cli@3.12 && \
  echo ''

WORKDIR /code

# Static as Service
FROM alpine as service

RUN \
  apk add nginx --no-cache && \
  mkdir /srv/web-app && \
  echo ''

COPY ./Docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./Docker/nginx/conf.d/ /etc/nginx/conf.d/

COPY ./dist/ /srv/web-app/

EXPOSE 80

CMD ["sh", "-c", "chown -R nginx:nginx /var/log/nginx && nginx"]
