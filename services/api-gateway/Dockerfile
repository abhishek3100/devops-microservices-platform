FROM node:18-alpine AS base
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY services/api-gateway/package*.json ./
RUN npm ci --only=production

# ---- Runner ----
FROM base AS runner

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY proto ./proto
COPY services/api-gateway .

USER appuser

EXPOSE 3000

CMD ["node", "src/index.js"]