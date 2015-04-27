import _ from 'underscore';

class Lov {

  constructor(name, values) {
    this.name = name;
    this.values = values;
  }

  static create(obj, name) {
    let values = obj.value.map((val) => {
      let pair = {};
      pair[val.code] = val.descr;
      return pair;
    });

    return new Lov(name, values);
  }
}

module.exports = Lov;
