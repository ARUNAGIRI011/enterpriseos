# Multi-stage Dockerfile for AegisNT Enterprise Desktop Preview
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json bun.lock* package-lock.json* ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Production runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install minimal serve utility or production runner
RUN npm install -g serve

# Copy built artifacts from builder
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start static preview server on port 3000 accessible from Windows host
CMD ["serve", "-s", "dist", "-l", "3000"]
