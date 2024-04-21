# Use the official Node.js LTS image as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /src

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Build your NestJS application (if needed)
RUN npm run build

# The port your app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]