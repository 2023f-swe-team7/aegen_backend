FROM node:18-alpine 

COPY . /build
WORKDIR /build

RUN npm install

RUN npx prisma generate
RUN npm run build

#RUN npx prisma migrate deploy
CMD [ "node dist/main.js" ] 