const Data = require('../models/data');
const _ = require('lodash');

const api = {};

// Read a document
// Look for a document with the given title,
// if not found, look for a document with the given ID
api.read = title => new Promise((resolve, reject) => {
  Data.query('type').eq('d').where('searchTitle').eq(title.toUpperCase()).exec((err, doc) => {
    if (err) {
      reject(err);
    } else if (!doc || doc.length !== 1) {
      Data.get({
        type: 'd',
        id: title,
      }, (err, doc) => {
        if (err) {
          reject(err);
          return;
        }
    
        if (!doc) {
          reject(new Error('Not Found'));
          return;
        }
    
        resolve(doc.toJson());
      });    
    } else {
      resolve(doc[0].toJson());
    }
  })
});

// Create a document
api.create = data => new Promise((resolve, reject) => {
  try {
    const toSave = {
      type: 'd',
      title: data.title,
      templateId: data.template,
      searchTitle: data.title.toUpperCase(),
      search: data.synopsis.toUpperCase(),
    };
    toSave.document = data;

    delete toSave.document.$href;
    delete toSave.document.title;
    delete toSave.document.template;
    delete toSave.document.createdAt;
    delete toSave.document.updatedAt;

    Data.create(toSave, (err, doc) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(doc.toJson());
    });
  } catch (err) {
    reject(err);
  }
});

// Update a document
api.update = data => new Promise((resolve, reject) => {
  try {
    const toSave = {
      type: 'd',
      id: data.$href.split('/').pop(),
      title: data.title,
      templateId: data.template,
      searchTitle: data.title.toUpperCase(),
      search: data.synopsis.toUpperCase(),
    };
    toSave.document = data;

    delete toSave.document.$href;
    delete toSave.document.title;
    delete toSave.document.template;
    delete toSave.document.createdAt;
    delete toSave.document.updatedAt;

    Data.update(toSave, (err, doc) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(doc.toJson());
    });
  } catch (err) {
    console.log(err);
    reject(err);
  }
});

module.exports = api;
