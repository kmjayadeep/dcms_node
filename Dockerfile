FROM node:boron

RUN npm install -g yarn

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

COPY package.json yarn.lock /usr/src/app/
RUN yarn

COPY . /usr/src/app/

EXPOSE 3000

CMD ["node","bin/www"]