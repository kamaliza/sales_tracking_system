# ---- Build Stage ----
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# ---- Run Stage ----
FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app .

CMD ["npm", "start"]
