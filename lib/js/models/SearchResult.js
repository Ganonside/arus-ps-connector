"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _ramda = require("ramda");

var R = _interopRequire(_ramda);

var _ = _ramda.__;

var SearchResult = (function () {
  function SearchResult() {
    _classCallCheck(this, SearchResult);

    this.objName = "new SearchResult object";
  }

  _createClass(SearchResult, null, {
    create: {
      value: function create(searchResultResp) {
        console.log(searchResultResp.ssrGetClassesResp.searchResult.subjects);

        var searchResult = {
          errorWarnText: searchResultResp.ssrGetClassesResp.searchResult.errorWarnText,
          wrnLmtExceed: searchResultResp.ssrGetClassesResp.searchResult.ssrWrnLmtExceed,
          errLmtExceed: searchResultResp.ssrGetClassesResp.searchResult.ssrErrLmtExceed,
          courseCount: searchResultResp.ssrGetClassesResp.searchResult.ssrCourseCount,
          classCount: searchResultResp.ssrGetClassesResp.searchResult.ssrClassCount,
          results: []
        };

        if (Array.isArray(searchResultResp.ssrGetClassesResp.searchResult.subjects)) {
          R.forEach(function (subject) {
            searchResult.results.push(subject);
          }, searchResultResp.ssrGetClassesResp.searchResult.subjects);
        }

        console.log("searchResult: ", searchResult.results);

        return new this();
      }
    }
  });

  return SearchResult;
})();

module.exports = SearchResult;