FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb* ./
RUN bun install

# Copy source
COPY . .

EXPOSE 5173

CMD ["bun", "run", "dev", "--host", "0.0.0.0"]
