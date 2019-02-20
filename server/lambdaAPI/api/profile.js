const Profile = require('../models/profile');

const api = {};

// Read a profile
api.read = username => new Promise((resolve, reject) => {
  Profile.get({
    username,
  }, { consistent: true }, (err, doc) => {
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
});

// Create a profile
api.create = data => new Promise((resolve, reject) => {
  try {
    Profile.create(data, (err, doc) => {
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

// Update a profile
api.update = data => new Promise((resolve, reject) => {
  try {
    const toSave = data;

    toSave.username = data.id;
    delete toSave.id;
    delete toSave.$href;
    delete toSave.createdAt;
    delete toSave.updatedAt;

    Profile.update(toSave, (err, doc) => {
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
