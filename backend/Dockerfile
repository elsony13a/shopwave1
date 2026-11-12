FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
ENV NODE_ENV=production
ARG VITE_API_BASE
ENV VITE_API_BASE=$VITE_API_BASE
EXPOSE 4000
CMD ["node", "src/server.js"]