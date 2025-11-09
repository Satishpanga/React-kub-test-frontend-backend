# Use Node 20 on Alpine
FROM node:20-alpine

# Workdir
WORKDIR /app

# Copy only manifest files first for better caching
COPY package*.json ./

# Prefer reproducible install, but fall back to a fresh install if the
# lockfile was generated on another OS/ABI and misses platform-specific
# optional deps like @rollup/rollup-linux-x64-musl.
# See npm optional-deps lockfile bug threads.
RUN npm ci || (rm -f package-lock.json && npm install)

# Copy the rest of the source
COPY . .

# Document Vite dev port
EXPOSE 5173

# Bind to all interfaces on a fixed port and fail fast if taken
CMD ["npm","run","dev","--","--host","0.0.0.0","--port","5173","--strictPort"]

