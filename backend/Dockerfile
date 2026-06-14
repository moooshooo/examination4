# backend/Dockerfile
FROM oven/bun:1-alpine
WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

COPY tsconfig.json ./
COPY src/ ./src/

ARG SERVICE=product-service
ENV SERVICE=${SERVICE}

CMD sh -c "bun run src/${SERVICE}/index.ts"
