

class Lov {

  constructor(name, values) {
    console.log(name, values);
    this.name = name;
    this.values = values;
  }

  static create(obj, name) {
    let values = obj.value.map((val) => {
      let pair = {};
      pair[val.code] = val.desc;
      return pair;
    });

    return new Lov(name, values);
  }
}

module.exports = Lov;
