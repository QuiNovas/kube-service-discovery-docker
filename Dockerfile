FROM node:alpine
MAINTAINER "Mathew Moon <mmoon@quinovas.com>"


RUN mkdir /scripts && \
    mkdir /ssl && \
    npm install portscanner @kubernetes/client-node && \
    wget -qO /bin/aws-iam-authenticator https://amazon-eks.s3-us-west-2.amazonaws.com/1.12.7/2019-03-27/bin/linux/amd64/aws-iam-authenticator

COPY index.js kubepoll.js certs.sh /scripts/

ENTRYPOINT ["node", "/scripts/index.js"]
      
