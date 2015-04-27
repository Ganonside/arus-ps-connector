"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _ = _interopRequire(require("underscore"));

var Lov = (function () {
  function Lov(name, values) {
    _classCallCheck(this, Lov);

    this.name = name;
    this.values = values;
  }

  _createClass(Lov, null, {
    create: {
      value: function create(obj, name) {
        var values = obj.value.map(function (val) {
          var pair = {};
          pair[val.code] = val.descr;
          return pair;
        });

        return new Lov(name, values);
      }
    }
  });

  return Lov;
})();

module.exports = Lov;