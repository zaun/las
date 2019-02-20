/* eslint-disable no-console */
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
const config = require('./lambdaAPI/config');
const DynamoDbLocal = require('dynamodb-local');
const dynamoose = require('dynamoose');
const express = require('express');
const lambda = require('./lambdaAPI');
const path = require('path');
const S3rver = require('s3rver');
const _ = require('lodash');

config.dynamoLocalPort = 8000;
config.apiLocalPort = 8081;
config.s3Port = 4569;
config.accessKeyId = 'key';
config.secretAccessKey = 'SECRET';
config.region = 'US-EAST-1';
config.s3Endpoint = `http://localhost:${config.s3Port}`;
config.dbEndpoint = `http://localhost:${config.dynamoLocalPort}`;
console.log(00, config);

// Setup database server
dynamoose.AWS.config.update({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
  region: config.region,
});
dynamoose.local(config.dbEndpoint);

let s3Config = null;
if (config.s3Endpoint) {
  s3Config = {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    endpoint: config.s3Endpoint
  };
}
var s3 = new AWS.S3(s3Config);

const app = express();
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Setup web server routes
const API_ROUTES = [
  '/user/:username',
  '/document',
  '/document/:title',
  '/media',
  '/search',
  '/template',
  '/template/:name'
];

// https://kennbrodhagen.net/2015/12/02/how-to-access-http-headers-using-aws-api-gateway-and-lambda/
API_ROUTES.forEach((route) => {
  app.all(route, (req, res) => {
    process.stdout.write(`??? ${req.method} ${req.originalUrl}`);
    lambda.handler({
      resource: route,
      headers: req.headers,
      httpMethod: req.method,
      queryStringParameters: req.params,
      query: req.query,
      body: JSON.stringify(req.body),
    }, {}, (err, result) => {
      const data = JSON.parse(result);
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      if (data.statusCode === 400) {
        console.log(`${data.statusCode} ${req.method} ${req.originalUrl} ${data.body}`);
      } else {
        console.log(`${data.statusCode} ${req.method} ${req.originalUrl}`);
      }
      res.status(data.statusCode).send(data.body);
    });
  });
});

// Create the needed table if it doesn't already exist
const createTable = model => new Promise((resolve, reject) => {
  const table = new dynamoose.Table(model.tableName, model.tableSchema, {}, dynamoose);
  table.init().then(() => {
    console.log(`Init table ${model.tableName}.`);
    table.waitForActive(resolve);
  }).catch(reject);
});


// Start dynamodb server then web server
console.log('Launching database');
DynamoDbLocal.launch(config.dynamoLocalPort, path.join(__dirname, 'temp'), [], false, false).then(() => {
  const models = [];
  models.push(require('./lambdaAPI/models/data'));
  models.push(require('./lambdaAPI/models/profile'));

  const creates = [];
  _.values(models).forEach((model) => {
    if (_.has(model, 'tableSchema')) {
      creates.push(createTable(model));
    }
  });

  console.log('Creating tables');
  return Promise.all(creates);
}).then(() => {
  console.log(`DynamoDB on port ${config.dynamoLocalPort}`);

  return new Promise((resolve, reject) => {
    new S3rver({
      port: config.s3Port,
      hostname: 'localhost',
      silent: false,
      cors: '<CORSConfiguration><CORSRule><AllowedOrigin>*</AllowedOrigin><AllowedMethod>*</AllowedMethod><MaxAgeSeconds>3000</MaxAgeSeconds><AllowedHeader>*</AllowedHeader></CORSRule></CORSConfiguration>',
      directory: path.join(__dirname, 'temp', 's3'),
      removeBucketsOnClose: true
    }).run((err, host, port) => {
      if(err) {
        return reject(err);
      }
      resolve();
    });
  });
}).then(() => {
  console.log(`S3 on port ${config.s3Port}`);

  return s3.createBucket({
    Bucket: 'media.las.com'
  }).promise();
}).then(() => {
  const server = app.listen(config.apiLocalPort, () => {
    console.log(`API on port ${server.address().port}`);
  });
}).catch((err) => {
  console.log(err);
});
