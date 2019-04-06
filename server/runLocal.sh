#!/bin/sh
rm -rf temp/s3/*
export applekeyid=H87QW5M6Z4
export appleteamid=8BU2Y8C5J7
export applekey=`base64 MapKitJS_AuthKey.p8`
node local
