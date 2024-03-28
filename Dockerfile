FROM node as frontend
WORKDIR /app
COPY . .
RUN npm i
RUN npm run build

EXPOSE 80 443
ENTRYPOINT ["npm", "start"]