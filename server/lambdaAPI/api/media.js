const AWS = require('aws-sdk');
const config = require('../config');
const Data = require('../models/data');
const uuidv4 = require('uuid/v4');
const _ = require('lodash');

const api = {};

getS3 = function() {
  let s3Config = null;
  if (config.s3Endpoint) {
    s3Config = {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      endpoint: config.s3Endpoint,
      s3ForcePathStyle: true
    };
  }
  return new AWS.S3(s3Config);
};


// List Media
api.list = title => new Promise((resolve, reject) => {
  reject(new Erroe('Not Implimented'))
});

// Get s signed S3 url to upload to
api.getSignedUrl = data => new Promise((resolve, reject) => {
  const s3 = getS3();

  try {
    s3.getSignedUrl('putObject', {
      Bucket: 'media.las.com',
      Key: 'temp/' + uuidv4(),
      Expires: 3600, // 1 hour
      ACL: 'bucket-owner-full-control',
      Metadata: {
        title: data.title,
        mimeType: data.mimeType
      }
    }, (err, url) => {
      if (err) {
        reject(err);
      } else {
        resolve(url);
      }
    });
  } catch (err) {
    reject(err);
  }
});

module.exports = api;
