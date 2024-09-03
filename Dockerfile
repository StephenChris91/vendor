# Use an official Node runtime as the parent image
FROM node:18

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Copy prisma directory (including schema.prisma)
COPY prisma ./prisma/

# Install the dependencies
RUN npm install

# Copy the rest of the source files into the image
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port 3000 for the app to be accessible
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "start"]