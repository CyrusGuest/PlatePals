# Use an official Node.js runtime as the base image
FROM --platform=linux/amd64 node:16-alpine


# Create and set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of your application's source code
COPY . .

# Expose the port your app runs on (if your app runs on a different port, update it here)
EXPOSE 8080

# Start the application
CMD ["node", "server.js"]
