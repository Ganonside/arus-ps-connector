import _ from 'underscore';

let serialize = function(obj) {
  let keys = _.keys(obj);
  keys = _.reject(keys, (key) => { return key === '$'; });

  return serializeKeys(keys, obj);
};

let serializeKeys = function(keys, obj) {
  let res = {};

  for (var i = 0; i < keys.length; i++) {
    let key = keys[i];
    let fieldName = toCamelCase(key);
    let value = obj[key];

    if (_.isArray(value) && value.length === 1) {
      value = value[0];
    }
    if (typeof value === 'object') {
      // If value is indexed like an array
      if (value[0]) {
        let values = [];
        for (let i = 0; value[i] !== undefined; i++) {
          values.push(serialize(value[i]));
        }

        value = values;
      } else {
        value = serialize(value);
      }
    }

    res[fieldName] = value;
  }

  return res;
};

let toCamelCase = function(str) {
  let words = str.toLowerCase().split('_');
  let camelCase = '';

  for (var i = 0; i < words.length; i++) {
    if (i > 0) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    camelCase += words[i];
  }

  return camelCase;
};

export default serialize;
