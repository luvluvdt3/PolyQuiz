# Build stage
FROM node:16.20-alpine3.17 AS build-stage

RUN addgroup -S appgroup && adduser -S appuser -G appgroup -s /bin/sh

WORKDIR /app

COPY --chown=appuser:appgroup package*.json ./

USER appuser

RUN npm ci

COPY --chown=appuser:appgroup . .

# Production stage
FROM node:16.20-alpine3.17 AS production-stage

RUN addgroup -S appgroup && adduser -S appuser -G appgroup -s /bin/sh

WORKDIR /app

COPY --from=build-stage --chown=appuser:appgroup /app /app

USER appuser

EXPOSE 9428

CMD ["npm", "start"]