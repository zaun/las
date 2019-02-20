const Data = require('../models/data');
const _ = require('lodash');

const api = {};

// Right now searching is wht DynamoDb so its limited and slow
// plans are to move this to CloudSearch at some point

api.all = title => new Promise((resolve, reject) => {
  Data.scan().filter('searchTitle').contains(title.toUpperCase()).or().filter('search').contains(title.toUpperCase()).exec((err, data) => {
    if (err) {
      reject(err);
    } else if (!data || data.length === 0) {
      reject(new Error('Not Found'));   
    } else {
      const ret = _.groupBy(data, 'type');
      ret.d = _.map(ret.d, d => d.toJson())
      ret.t = _.map(ret.t, t => t.toJson())
      resolve(ret);
    }
  })
});

module.exports = api;
