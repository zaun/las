const Data = require('../models/data');
const _ = require('lodash');

const api = {};

// List a template
api.list = name => new Promise((resolve, reject) => {
  let q = Data.query('type').eq('t');
  if (name) {
    q = q.where('searchTitle').beginsWith(name.toUpperCase());
  }
  q.exec((err, doc) => {
    if (err) {
      reject(err);
    } else if (!doc || doc.length === 0) {
      reject(new Error('Not Found'));   
    } else {
      resolve(_.map(doc, d => d.toJson()));
    }
  })
});

// Read a template
// Look for a template with the given title,
// if not found, look for a template with the given ID
api.read = name => new Promise((resolve, reject) => {
  Data.query('type').eq('t').where('searchTitle').eq(name.toUpperCase()).exec((err, doc) => {
    if (err) {
      reject(err);
    } else if (!doc || doc.length !== 1) {
      Data.get({
        type: 't',
        id: name
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

// Create a template
api.create = data => new Promise((resolve, reject) => {
  try {
    const toSave = {
      type: 't',
      title: data.name,
      searchTitle: data.name.toUpperCase(),
      search: data.description.toUpperCase(),
    };
    toSave.template = data;
    if (!toSave.template.attributes) {
      toSave.template.attributes = [];
    }
    if (!toSave.template.sections) {
      toSave.template.sections = [];
    }

    delete toSave.template.$href;
    delete toSave.template.title;
    delete toSave.template.createdAt;
    delete toSave.template.updatedAt;

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

// Update a template
api.update = data => new Promise((resolve, reject) => {
  try {
    const toSave = {
      type: 't',
      id: data.$href.split('/').pop(),
      title: data.name,
      searchTitle: data.name.toUpperCase(),
    };
    toSave.template = data;

    delete toSave.template.$href;
    delete toSave.template.title;
    delete toSave.template.createdAt;
    delete toSave.template.updatedAt;

    Data.update(toSave, (err, doc) => {
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

module.exports = api;
