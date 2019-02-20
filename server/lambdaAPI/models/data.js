const dynamoose = require('dynamoose');
const uuidv4 = require('uuid/v4');
const _ = require('lodash');

const schema = new dynamoose.Schema({
  type: {
    type: String,
    enum: ['d', 'm', 't'], // Document, Media or Template
    hashKey: true,
  },

  id: {
    type: String,
    default: uuidv4,
    rangeKey: true,
  },

  searchTitle: {
    type: String,
    trim: true,
    uppercase: true,
    index: true,
  },

  search: {
    type: String,
    trim: true,
    uppercase: true,
    index: true,
  },

  title: {
    type: String,
    trim: true,
  },

  templateId: {
    type: String,
    trim: true,
    index: true,
  },

  document: {
    type: Map,
    map: {
      synopsis: {
        type: String,
        trim: true,
      },
    
      attributes: {
        type: Object
      },
    
      sections: {
        type: Object
      },
    }
  },

  media: {
    type: Map,
    map: {
      mimeType: {
        type: String
      },
    }
  },

  template: {
    type: Map,
    map: {
      attributes: {
        type: Object
      },

      description: {
        type: String
      },

      sections: {
        type: Object
      },
    }
  },
}, {
  useNativeBooleans: true,
  useDocumentTypes: true,
  timestamps: true,
  throughput: { read: 1, write: 1 },
});

const tableName = 'Data';
const model = dynamoose.model(tableName, schema, { create: false });
model.tableSchema = schema;
model.tableName = tableName;

model.prototype.toJson = function toJson() {
  let ret = null;
  if (this.type === 'd') {
    ret = _.cloneDeep(this.document);
    ret.$href = `/document/${this.id}`;
    ret.title = this.title;
    ret.template = this.templateId;
  } else if (this.type === 'm') {
    ret = _.cloneDeep(this.document);
    ret.$href = `/media/${this.id}`;
    ret.title = this.title;
  } else {
    ret = _.cloneDeep(this.template);
    ret.$href = `/template/${this.id}`;
    ret.name = this.title;
  }
  
  return ret;
};

module.exports = model;
