# Step 1: Use an official Node.js runtime as a base image
FROM node:18

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Step 4: Install the project dependencies
RUN npm install

# Step 5: Copy the rest of the project files to the container
COPY . .

# Step 6: Expose the port the app runs on (assuming it's 3000, change if different)
EXPOSE 3000

# Step 7: Start the server by running startServer.js
CMD ["node", "Startserver.js"]
