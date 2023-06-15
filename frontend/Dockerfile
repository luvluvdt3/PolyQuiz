# Build stage
FROM node:16.20-alpine3.17 AS build-stage

RUN addgroup -S appgroup && adduser -S appuser -G appgroup -s /bin/sh

WORKDIR /app

COPY package*.json ./

RUN npm ci && chown -R appuser:appgroup /app

USER appuser

COPY . .

RUN npx ng build --prod

# Production stage
FROM nginx:1.24.0 AS production-stage

RUN groupadd appgroup && \
    useradd --no-log-init -r -g appgroup appuser && \
    mkdir -p /var/cache/nginx/client_temp && \
    chown -R appuser:appgroup /var/cache/nginx

COPY --from=build-stage --chown=appuser:appgroup /app/dist/front-end /usr/share/nginx/html

COPY --chown=appuser:appgroup ./nginx.conf /etc/nginx/conf.d/default.conf

USER appuser

EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]
