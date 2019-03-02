#!/bin/sh
rm -rf temp/s3/*
export kid=maps.com.las
export iss=8BU2Y8C5J7
export key=`base64 MapKitJS_AuthKey.p8`
node local
