FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --force

COPY . .

RUN npm run build -- --configuration production

RUN npm install -g serve

EXPOSE 80

CMD ["serve", "-s", "dist/ecommerce-web", "-l", "80"]
