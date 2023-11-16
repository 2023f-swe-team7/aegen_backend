FROM node:18-alpine AS builder

COPY . /build
WORKDIR /build

RUN npm install

RUN npx prisma generate
RUN npm run build

FROM node:18-alpine

COPY --from=builder /build .
RUN ["chmod", "+x", "./builder/entrypoint.sh"]
COPY ./builder/entrypoint.sh .

ENTRYPOINT [ "./entrypoint.sh" ]
