"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _ = _interopRequire(require("underscore"));

/**
 * The description of this class
 *
 * @class
 */

var Subjects = (function () {
  function Subjects(params) {
    var _this = this;

    _classCallCheck(this, Subjects);

    Object.keys(params).map(function (key) {
      return _this[key] = params[key];
    });
  }

  _createClass(Subjects, null, {
    create: {
      value: function create(obj) {
        var subjects = [];
        if (_.isArray(obj.ssrGetCoursesResp.courseSearchResult.subjects.subject)) {
          obj.ssrGetCoursesResp.courseSearchResult.subjects.subject.map(function (subject) {
            subjects.push(new Subject(subject));
          });
        } else {
          subjects.push(new Subject(obj.ssrGetCoursesResp.courseSearchResult.subjects.subject));
        }

        return new Subjects(subjects);
      }
    }
  });

  return Subjects;
})();

var Subject = function Subject(params) {
  var _this = this;

  _classCallCheck(this, Subject);

  Object.keys(params).map(function (key) {
    return _this[key] = params[key];
  });
};

module.exports = Subjects;