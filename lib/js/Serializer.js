"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _ = _interopRequire(require("underscore"));

/* eslint-disable */

var Profile = _interopRequire(require("./models/Profile.js"));

var Picture = _interopRequire(require("./models/Picture.js"));

var Schedule = _interopRequire(require("./models/Schedule.js"));

var Subjects = _interopRequire(require("./models/Subjects.js"));

var Courses = _interopRequire(require("./models/Courses.js"));

var Notification = _interopRequire(require("./models/Notification.js"));

var NtfEvent = _interopRequire(require("./models/NtfEvent.js"));

var Lov = _interopRequire(require("./models/Lov.js"));

/* eslint-enable */

var serialize = _interopRequire(require("./Serialize.js"));

/**
 * Handles the formatting of remote request responses responses.
 *
 * @class
 */
/* eslint-disable */

var Serializer = (function () {
  function Serializer() {
    _classCallCheck(this, Serializer);
  }

  _createClass(Serializer, null, {
    profile: {
      /* eslint-enable */

      /**
       * Serializes data into a `Profile` object
       *
       * @method profile
       * @static
       * @param {object} profileData - the data that needs to be serialized into a `Profile`
       * @param {function} model - a function that handles the mapping of the serialized data. It must
       * have a `create` method. Defaults to `Profile`
       * @return {model} - returns an instance of `model`
       */

      value: function profile(profileData) {
        var model = arguments[1] === undefined ? Profile : arguments[1];

        return model.create(serialize(profileData));
      }
    },
    picture: {

      /**
       * Serializes data into a `Picture` object
       *
       * @method picture
       * @static
       * @param {object} pictureData - the data that needs to be serialized into a `Picture`
       * @param {function} model - a function that handles the mapping of the serialized data. It must
       * have a `create` method. Defaults to `Picture`
       * @return {model} - returns an instance of `model`
       */

      value: function picture(pictureData) {
        var model = arguments[1] === undefined ? Picture : arguments[1];

        return model.create(serialize(pictureData));
      }
    },
    schedule: {

      /**
       * Serializes data into a `Schedule` object
       *
       * @method schedule
       * @static
       * @param {object} scheduleData - the data that needs to be serialized into a `Schedule`
       * @param {Num} payloadMode - specifies the format the payload will come back in; must be 1, 2,
       * or 3 and defaults to 1
       * @param {function} model - a function that handles the mapping of the serialized data. It must
       * have a `create` method. Defaults to `Schedule`
       * @return {model} - returns an instance of `model`
       */

      value: function schedule(scheduleData, payloadMode) {
        var model = arguments[2] === undefined ? Schedule : arguments[2];

        return model.create(serialize(scheduleData), payloadMode);
      }
    },
    subjects: {

      /**
       * Serializes data into a `Subjects` object
       *
       * @param {object} subjectsData - the data being serialized
       * @param {function} model - handles the mapping of the serialized data. Must have a `create`
       * method. Defaults to `Subjects`
       * @returns an instance of `model`
       */

      value: function subjects(subjectsData) {
        var model = arguments[1] === undefined ? Subjects : arguments[1];

        return model.create(serialize(subjectsData));
      }
    },
    courses: {
      value: function courses(coursesData) {
        var model = arguments[1] === undefined ? Courses : arguments[1];

        return model.create(serialize(coursesData));
      }
    },
    notifications: {

      /**
       * Serializes data into a `Notification` object
       *
       * @method notifications
       * @static
       * @param {object} notificationData
       * @param {function} model - a function that handles the mapping of the serialized data. It must
       * have a `create` method. Defaults to `Notification`
       * @return {Array<model>} - returns an Array of `model` objects
       */

      value: function notifications(notificationsData) {
        var model = arguments[1] === undefined ? Notification : arguments[1];

        var notifications = [];

        notifications = _.map(notificationsData.SCC_GET_NOTIF_RESP.NTK_ITEM, function (notification) {
          return model.create(serialize(notification));
        });

        return notifications;
      }
    },
    events: {

      /**
       * Serializes data into an `Event` object
       *
       * @param {object} eventsData
       * @param {function} model - a function that handles the mapping of the serialized data. It must
       * have a `create` method. Defaults to `NtfEvent`
       * @return {Array<model>} - returns an Array of `model` objects
       */

      value: function events(eventsData) {
        var model = arguments[1] === undefined ? NtfEvent : arguments[1];

        var events = [];

        events = _.map(eventsData.SCC_NTF_GET_EVENTS_RESP.SCC_NTF_EVENT, function (evt) {
          return model.create(serialize(evt));
        });

        return events;
      }
    },
    lovs: {
      value: function lovs(lovData) {
        var model = arguments[1] === undefined ? Lov : arguments[1];

        var lovs = [];
        lovs = lovData.SCC_LOV_RESP.LOVS[0].LOV.map(function (lov) {
          return model.create(serialize(lov.VALUES[0]), lov.$.name);
        });

        return lovs;
      }
    }
  });

  return Serializer;
})();

module.exports = Serializer;