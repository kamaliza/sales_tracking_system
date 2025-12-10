# Multi-stage build for optimized image size

# ---- Build Stage ----
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
# Using npm install to handle cases where package-lock.json might be out of sync
RUN npm install --no-audit --no-fund && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# ---- Production Stage ----
FROM nginx:alpine

# Copy custom nginx config (if exists)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
