FROM node:14-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code to the working directory
COPY . .

# Expose the port your app will run on
EXPOSE 3000

# Define the command to run your application in development mode
CMD [ "npm", "run", "start:dev" ]