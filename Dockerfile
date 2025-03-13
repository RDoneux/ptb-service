# Use an official Node.js runtime as a parent image
FROM node:22

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Copy the rest of your application files
COPY . .

# Install dependencies
RUN npm install

# Expose port 4000 for the application
EXPOSE 4000

# Start the application
CMD ["npm", "start"]
