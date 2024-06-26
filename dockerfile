# Use an official Node runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Install any needed packages specified in package.json
RUN npm i

# Make port 3000 available to the world outside this container
EXPOSE 3001

# Define environment variable
ENV MONGO_DB_URI=mongodb://mongo:27017/hotel

# Run npm start when the container launches
CMD ["npm", "start"]
