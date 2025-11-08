# 1️⃣ Use Node base image
FROM node:20-alpine

# 2️⃣ Set working directory
WORKDIR /app

# 3️⃣ Copy package files first
COPY package*.json ./

# 4️⃣ Install dependencies
RUN npm install

# 5️⃣ Copy rest of the code
COPY . .

# 6️⃣ Expose Vite's default dev server port
EXPOSE 5173

# 6️⃣ Start app
CMD ["npm", "run", "dev", "--", "--host"]

# 7️⃣ Start the Vite development server
#CMD ["npm", "run", "dev"]

# 6️⃣ Expose frontend port (React default port is 3000)
#EXPOSE 5173

#to start the server
#CMD ["npm", "start"]
