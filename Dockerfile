FROM node:20 AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

RUN npm install

# Copy all TypeScript config files needed for build
COPY tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts ./

COPY index.html .
COPY tsconfig.json .
COPY src ./src
COPY public ./public

RUN npm run build

# Serve with nginx
FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]