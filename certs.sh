#!/bin/sh

if [ ! -z "${GENERATE_CERT}" ]; then
  apk add --no-cache openssl
  mkdir /ssl
  cd /ssl

  CSR_CONFIG=$(cat<<EOF
   [ req ]
   distinguished_name="req_distinguished_name"
   prompt="no"

   [ req_distinguished_name ]
   C="US"
   ST="AL"
   L="Birmingham"
   O="Nobody"
   CN="Nobody.io"
EOF
  )


  echo "$CSR_CONFIG" >csr.conf
  KEY_NAME=key

  openssl req -config csr.conf -new -newkey rsa:2048 -nodes -keyout ${KEY_NAME}.key -out ${KEY_NAME}.csr

  echo "Created ${KEY_NAME}.key"
  echo "Created ${KEY_NAME}.csr"

  openssl x509 -req -days 3500 -in ${KEY_NAME}.csr -signkey ${KEY_NAME}.key -out ${KEY_NAME}.crt
  echo "Created ${KEY_NAME}.crt (self-signed)"

  chmod 700 /ssl
  chmod 700 /ssl/key.crt
  chmod 400 /ssl/key.key
fi
