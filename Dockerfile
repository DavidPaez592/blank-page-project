# Use the official oven/bun:alpine image as the base image
FROM oven/bun:alpine AS build

# Set the working directory
WORKDIR /app

# Copy the rest of the application code
COPY . .

# Set the HUSKY environment variable to 0 to prevent Husky from being executed
ENV HUSKY=0

# Install the application dependencies and build the application
RUN bun install --silent \
  && bun run build

# Use a smaller base image for the final image
FROM nginx:1.27.3-alpine

# Set the working directory in the container to /usr/share/nginx/html
WORKDIR /usr/share/nginx/html

# Remove default Nginx content
RUN rm -rf ./*

# Copy only the necessary files from the build stage
COPY --from=build /app/dist .

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD ["nginx", "-g", "daemon off;"]