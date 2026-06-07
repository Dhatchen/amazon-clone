# 1. Start with a lightweight version of Node.js
FROM node:20-alpine

# 2. Tell Docker to do everything inside an /app folder
WORKDIR /app

# 3. Copy only the package files first (this makes future builds much faster)
COPY package*.json ./

# 4. Install backend dependencies
RUN npm install

# 5. Copy the rest of your backend code into the container
COPY . .

# 6. Expose the port your server runs on
EXPOSE 5000

# 7. The command to start your API
CMD ["node", "src/server.js"]