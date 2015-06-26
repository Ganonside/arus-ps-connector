"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/**
 * Serves as the model for NtfEvent data
 *
 * @class
 */

var UCIDLookup = (function () {
  function UCIDLookup(UCIDData) {
    var _temp;

    _classCallCheck(this, UCIDLookup);

    /* eslint-disable */
    var fields = (_temp = UCIDData, this.status = _temp.status, this.providedIdType = _temp.providedIdType, this.emplid = _temp.emplid, this.firstName = _temp.firstName, this.lastName = _temp.lastName, _temp);
  }

  _createClass(UCIDLookup, null, {
    create: {
      value: function create(obj) {
        var _UCIDLookup = {
          status: obj.status,
          providedIdType: obj.providedIdType,
          emplid: obj.person.emplid,
          firstName: obj.person.firstName,
          lastName: obj.person.lastName
        };

        return new UCIDLookup(_UCIDLookup);
      }
    }
  });

  return UCIDLookup;
})();

module.exports = UCIDLookup;

/* eslint-enable */