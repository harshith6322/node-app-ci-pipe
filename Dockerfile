FROM node:lts-alpine3.20
WORKDIR /App

COPY package.json package-lock.json ./ 
RUN npm install
COPY . . 
EXPOSE 3000
CMD ["npm", "start"]


# FROM node:lts-alpine3.20
# WORKDIR /app
# COPY . .
# RUN npm install 
# CMD ["npm", "start"] 
 
