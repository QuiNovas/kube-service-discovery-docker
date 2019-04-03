FROM node:alpine
MAINTAINER "Mathew Moon <mmoon@quinovas.com>"


RUN mkdir /scripts && \
    mkdir /ssl && \
    apk add openssl && \
    npm install portscanner @kubernetes/client-node

COPY index.js kubepoll.js certs.sh /scripts/

ENTRYPOINT ["node", "/scripts/index.js"]
