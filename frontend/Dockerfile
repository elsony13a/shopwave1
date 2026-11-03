FROM oven/bun:1 AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install
COPY . .
# استخدم الاسم الصحيح الذي يطلبه الكود:
ARG VITE_API_BASE
ENV VITE_API_BASE=$VITE_API_BASE
RUN bun run build

# باقي مرحلة Nginx...
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]