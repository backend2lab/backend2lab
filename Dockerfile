FROM node:18-alpine AS base

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY client/package.json ./client/
COPY server/package.json ./server/

RUN pnpm install --frozen-lockfile

COPY . .

FROM base AS client-builder
WORKDIR /app
RUN pnpm run build:client

FROM base AS server-builder
WORKDIR /app
RUN pnpm run build:server

FROM node:18-alpine AS production

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY client/package.json ./client/
COPY server/package.json ./server/

RUN pnpm install --frozen-lockfile --prod

COPY --from=client-builder /app/client/dist ./client/dist

COPY --from=server-builder /app/server/dist ./server/dist
COPY --from=server-builder /app/server/src/modules ./server/dist/modules

COPY server/src/modules ./server/dist/modules

COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

EXPOSE 4000 4200

CMD ["/app/start.sh"]
