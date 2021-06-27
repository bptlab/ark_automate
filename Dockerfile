FROM node:alpine AS builder

WORKDIR /usr/src/ark_automate-frontend
COPY frontend .
RUN npm install && \
    npm run build

WORKDIR /usr/src/ark_automate-backend
COPY server .
RUN npm install

FROM node:alpine
WORKDIR /usr/src/ark_automate
COPY --from=builder /usr/src/ark_automate-backend .
COPY --from=builder /usr/src/ark_automate-frontend/build build
CMD npm run start