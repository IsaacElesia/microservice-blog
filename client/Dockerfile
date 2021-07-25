FROM node:alpine

# ENV = Environment Variable
ENV CI=true

WORKDIR /app

COPY ./package.json ./
RUN npm i 

COPY ./ ./

CMD ["npm","start"]