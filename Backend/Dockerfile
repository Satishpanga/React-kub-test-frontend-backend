# 1️⃣ Use Node base image
FROM node:18-alpine

# 2️⃣ Set working directory
WORKDIR /app

# 3️⃣ Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# 4️⃣ Copy all project files
COPY . .

# 5️⃣ Expose backend port
EXPOSE 5000

# 6️⃣ Start the backend
CMD ["node", "server.js"]