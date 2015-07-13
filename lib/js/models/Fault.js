"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _ = _interopRequire(require("underscore"));

/**
 * @class Fault
 */

var Fault = function Fault(faultObj) {
  _classCallCheck(this, Fault);

  var responseName = Object.keys(faultObj)[0];

  var messages = [];
  if (_.isArray(faultObj[responseName].sccFaultResp.detail.msgs.msg)) {
    _.each(faultObj[responseName].sccFaultResp.detail.msgs.msg, function (faultMessage) {
      messages.push(faultMessage);
    });
  } else {
    messages.push(faultObj[responseName].sccFaultResp.detail.msgs.msg);
  }

  this.responseName = responseName;
  this.faultMessages = messages;
};

module.exports = Fault;