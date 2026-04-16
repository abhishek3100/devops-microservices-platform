FROM node:18-alpine AS base

WORKDIR /app

FROM base AS deps
COPY services/user-service/package*.json ./
RUN npm ci --only=production

FROM base AS runner

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY services/user-service/. .

USER appuser

EXPOSE 4000

CMD ["node", "src/index.js"]