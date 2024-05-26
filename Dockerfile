# Example Dockerfile for each microservice (user-service, workspace-service, etc.)
FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install


# Bundle app source
COPY . .

# Générez Prisma
RUN npx prisma generate


# Expose port
EXPOSE 4000

# Command to run the app avec yarn
CMD ["yarn", "start"]
