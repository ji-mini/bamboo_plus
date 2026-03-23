FROM node:22-alpine AS base
WORKDIR /app

COPY backend/package*.json ./
RUN npm ci

COPY backend/tsconfig.json ./tsconfig.json
COPY backend/prisma.config.ts ./prisma.config.ts
COPY backend/prisma ./prisma
RUN npx prisma generate

COPY backend/src ./src

FROM base AS development
COPY docker/backend/dev-entrypoint.sh /usr/local/bin/dev-entrypoint.sh
RUN chmod +x /usr/local/bin/dev-entrypoint.sh
EXPOSE 4001
CMD ["sh", "/usr/local/bin/dev-entrypoint.sh"]

FROM base AS build
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY backend/package*.json ./
RUN npm ci

COPY backend/tsconfig.json ./tsconfig.json
COPY backend/prisma.config.ts ./prisma.config.ts
COPY backend/prisma ./prisma
RUN npx prisma generate

COPY --from=build /app/dist ./dist
COPY docker/backend/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 4001
ENTRYPOINT ["sh", "/usr/local/bin/entrypoint.sh"]
CMD ["node", "dist/server.js"]
