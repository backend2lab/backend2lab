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
