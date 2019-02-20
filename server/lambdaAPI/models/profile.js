const dynamoose = require('dynamoose');
const _ = require('lodash');

const schema = new dynamoose.Schema({
  username: {
    type: String,
    hashKey: true,
  },

  firstName: {
    type: String,
  },

  middleName: {
    type: String,
  },

  lastName: {
    type: String,
  },
}, {
  useNativeBooleans: true,
  timestamps: true,
  throughput: { read: 1, write: 1 },
});

const tableName = 'Profiles';
const model = dynamoose.model(tableName, schema, { create: false });
model.tableSchema = schema;
model.tableName = tableName;

model.prototype.toJson = function toJson() {
  const ret = _.cloneDeep(this);
  ret.$href = `/profile/${ret.username}`;

  ret.id = ret.username;
  delete ret.username;

  return ret;
};

module.exports = model;
