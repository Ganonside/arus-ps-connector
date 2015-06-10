"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/**
 * Serves as the model for NtfEvent data
 *
 * @class
 */

var NtfEvents = (function () {
  function NtfEvents(eventData) {
    var _temp;

    _classCallCheck(this, NtfEvents);

    /* eslint-disable */
    var fields = (_temp = eventData, this.totalEventsCount = _temp.totalEventsCount, this.readEventsCount = _temp.readEventsCount, this.unreadEventsCount = _temp.unreadEventsCount, _temp);
  }

  _createClass(NtfEvents, null, {
    create: {
      value: function create(obj) {
        var ntfEvents = {
          totalEventsCount: obj.totalEventsCount,
          readEventsCount: obj.readEventsCount,
          unreadEventsCount: obj.unreadEventsCount
        };

        return new NtfEvents(ntfEvents);
      }
    }
  });

  return NtfEvents;
})();

module.exports = NtfEvents;

/* eslint-enable */