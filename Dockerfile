# Stage 1: Build the React app
FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install --legacy-peer-deps
COPY . .

# Build
RUN yarn run build:pro

# Stage 2: Serve the app using nginx
FROM nginx:alpine

# Remove the default Nginx website
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]