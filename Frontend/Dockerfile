# # Use Node 20 on Alpine
# FROM node:20-alpine

# # Workdir
# WORKDIR /app

# # Copy only manifest files first for better caching
# COPY package*.json ./

# # Prefer reproducible install, but fall back to a fresh install if the
# # lockfile was generated on another OS/ABI and misses platform-specific
# # optional deps like @rollup/rollup-linux-x64-musl.
# # See npm optional-deps lockfile bug threads.
# RUN npm ci || (rm -f package-lock.json && npm install)

# # Copy the rest of the source
# COPY . .

# # Document Vite dev port
# EXPOSE 5173

# # Bind to all interfaces on a fixed port and fail fast if taken
# CMD ["npm","run","dev","--","--host","0.0.0.0","--port","5173","--strictPort"]





# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# (Optional) Custom nginx config for SPA routing. Otherwise uses default.
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
