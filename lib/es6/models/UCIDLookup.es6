/**
 * Serves as the model for NtfEvent data
 *
 * @class
 */
class UCIDLookup {

  constructor(UCIDData) {
    /* eslint-disable */
    let fields = {
    /* eslint-enable */
      status: this.status,
      providedIdType: this.providedIdType,
      emplid: this.emplid,
      firstName: this.firstName,
      lastName: this.lastName
    } = UCIDData;
  }

  static create(obj) {
    let _UCIDLookup = {
      status: obj.status,
      providedIdType: obj.providedIdType,
      emplid: obj.person.emplid,
      firstName: obj.person.firstName,
      lastName: obj.person.lastName
    };

    return new UCIDLookup(_UCIDLookup);
  }
}

module.exports = UCIDLookup;
