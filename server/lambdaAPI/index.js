const fs = require('fs');
const jwt = require('jsonwebtoken');
const libbase64 = require('libbase64');
const util = require('./util');

const document = require('./api/document');
const media = require('./api/media');
const profile = require('./api/profile');
const search = require('./api/search');
const template = require('./api/template');

const verify = event => new Promise((resolve) => {
  if (event.auth && event.auth.token) {
    jwt.verify(event.auth.token, util.JWT_KEY, (err, decoded) => {
      if (err) {
        resolve();
        return;
      }
      resolve(decoded.payload);
    });
  } else {
    resolve();
  }
});

exports.handler = (event, context, callback) => {
  const done = (statusCode, response) => {
    callback(null, JSON.stringify({
      statusCode,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
      },
      body: JSON.stringify(response),
    }));
  };

  const route = {
    resource: event.resource.toUpperCase(),
    method: event.httpMethod.toUpperCase(),
    parms: event.queryStringParameters,
    query: event.query,
    auth: { },
  };

  if (event.headers.authorization) {
    route.auth.token = event.headers.authorization.split(' ').pop();
  }

  try {
    route.bodyJson = JSON.parse(event.body);
  } catch (e) {
    route.bodyJson = {};
  }

  verify(route).then((data) => {
    if (data) {
      route.auth = data;
    }

    switch (route.resource) {
      case '/PROFILE/:USERNAME':
        if (route.method === 'GET') {
          profile.read(route.parms.username).then((profileData) => {
            const ret = profileData;
            ret.mine = false;
            console.log(profileData.id, route.auth.username);
            if (profileData.id === route.auth.username) {
              ret.mine = true;
            }

            if (!ret.mine && !ret.firstName && !ret.lastName && !ret.middleName && !ret.nickname) {
              done(404, 'Not Found');
              return;
            }

            done(200, ret);
          }).catch((err) => {
            if (err.message === 'Not Found') {
              done(404, err.message);
              return;
            }
            done(400, err.message);
          });
        } else if (route.method === 'POST') {
          const b = route.bodyJson;
          if (b.id !== route.auth.username) {
            done(401, `${route.auth.username} Not Authorized`);
            return;
          }
          profile.update(b).then((profileData) => {
            const ret = profileData;
            ret.mine = false;
            if (profileData.id === route.auth.username) {
              ret.mine = true;
            }

            done(201, ret);
          }).catch((err) => {
            done(500, err.message);
          });
        } else {
          done(405, `Method Not Allowed: ${route.method}`);
        }
        break;

      case '/DOCUMENT':
        if (route.method === 'POST') {
          const b = route.bodyJson;
          if (!b || !b.title || !b.template || !b.synopsis) {
            done(400, 'Invalid missing title, template or synopsis');
            return
          }

          if (b.$href) {
            done(400, 'Invlid contains $href')
          }

          document.create(b).then((documentData) => {
            done(201, documentData);
          }).catch((err) => {
            done(400, err.message);
          });
        } else {
          done(405, `Method Not Allowed: ${route.method}`);
        }
        break;

      case '/DOCUMENT/:TITLE':
        if (route.method === 'GET') {
          document.read(route.parms.title).then((documentData) => {
            done(200, documentData);
          }).catch((err) => {
            if (err.message === 'Not Found') {
              done(404, err.message);
              return;
            }
            done(400, err.message);
          });
        } else if (route.method === 'PUT') {
          const b = route.bodyJson;
          if (!b || !b.$href || b.$href.split('/').pop() !== route.parms.title) {
            done(400, 'Invalid $href');
            return
          }

          document.update(b).then((documentData) => {
            const ret = documentData;
            done(201, ret);
          }).catch((err) => {
            done(500, err.message);
          });
        } else {
          done(405, `Method Not Allowed: ${route.method}`);
        }
        break;  

      case '/MEDIA':
        if (route.method === 'POST') {
          const b = route.bodyJson;
          if (!b || !b.mimeType || !b.title) {
            done(400, 'Invalid missing mimeType or title');
            return
          }

          media.getSignedUrl(b).then((url) => {
            done(200, url);
          }).catch((err) => {
            done(400, err.message);
          });
        } else {
          done(405, `Method Not Allowed: ${route.method}`);
        }
        break;

      case '/SEARCH':
        if (route.method === 'GET') {
          if (!route.query.q) {
            done(400, 'Missing \'q\' query');
            return
          }
          search.all(route.query.q).then((documentData) => {
            const ret = documentData;
            done(200, ret);
          }).catch((err) => {
            if (err.message === 'Not Found') {
              done(404, err.message);
              return;
            }
            done(400, err.message);
          });
        } else {
          done(405, `Method Not Allowed: ${route.method}`);
        }
        break;

      case '/TEMPLATE':
        if (route.method === 'GET') {
          template.list(route.query.q).then((templateData) => {
            const ret = templateData;
            done(200, ret);
          }).catch((err) => {
            if (err.message === 'Not Found') {
              done(404, err.message);
              return;
            }
            done(400, err.message);
          });
        } else if (route.method === 'POST') {
          const b = route.bodyJson;
          if (!b.name || !b.description) {
            done(400, 'Missing \'name\' or  \'description\' query');
            return
          }
          template.create(b).then((templateData) => {
            const ret = templateData;
            done(200, ret);
          }).catch((err) => {
            done(400, err.message);
          });
        } else {
          done(405, `Method Not Allowed: ${route.method}`);
        }
        break;

      case '/TEMPLATE/:NAME':
        if (route.method === 'GET') {
          template.read(route.parms.name).then((templateData) => {
            const ret = templateData;
            done(200, ret);
          }).catch((err) => {
            if (err.message === 'Not Found') {
              done(404, err.message);
              return;
            }
            console.log(err.stack)
            done(400, err.message);
          });
        } else if (route.method === 'PUT') {
          const b = route.bodyJson;
          if (!b || !b.$href || b.$href.split('/').pop() !== route.parms.name) {
            done(400, 'Invalid $href');
            return
          }

          template.update(b).then((templateData) => {
            const ret = templateData;
            done(201, ret);
          }).catch((err) => {
            done(500, err.message);
          });
        } else {
          done(405, `Method Not Allowed: ${route.method}`);
        }
        break;  

      case '/TOKEN/:TYPE':
        if (route.method === 'GET' && route.parms.type === 'mapkit') {
          if (!process.env.applekeyid || !process.env.appleteamid || !process.env.applekey) {
            done(500, `Missing key file environment variable(s)`);
            return;
          }

          jwt.sign({
            // origin: event.local === true ? 'https://zaun.github.io' : 'NO'
            origin: event.local === true ? 'http://localhost:8082' : 'NO'
          }, libbase64.decode(process.env.applekey), {
            keyid: process.env.applekeyid,
            issuer: process.env.appleteamid,
            expiresIn: '4m',
            algorithm: 'ES256',
          }, (err, token) => {
            if (err) {
              done(500, err);
            } else {
              done(200, { token });
            }
          });
        } else {
          done(405, `Method Not Allowed: ${route.method}`);
        }
        break;  
  

      default:
        done(400, `Bad Request: ${route.resource}`);
    }
  });
};
