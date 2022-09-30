# syntax=docker/dockerfile:1
FROM node:16
WORKDIR /app
COPY ["package.json", "./"]
COPY ["tsconfig.json","./"] 
COPY src ./src
RUN npm install
RUN npm run build

FROM node:16
ENV NODE_ENV=production
WORKDIR /app
COPY package.json ./
RUN npm install --only=production
COPY --from=0 /app/dist ./
EXPOSE 80
CMD [ "node", "index.js" ]