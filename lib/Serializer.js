var _ = require('underscore');
import Profile from './models/Profile.js';
import Picture from './models/Picture.js';
import Schedule from './models/Schedule.js';
import Notification from './models/Notification.js';
import NtfEvent from './models/NtfEvent.js';
import serialize from './Serialize.js';
/**
 * Handles the formatting of remote request responses responses.
 *
 * @class
 */
/* eslint-disable */
class Serializer {
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
  static profile(profileData, model = Profile) {
    return model.create(serialize(profileData));
  }

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
  static picture(pictureData, model = Picture) {
    return model.create(serialize(pictureData));
  }

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
  static schedule(scheduleData, payloadMode, model = Schedule) {
    return model.create(serialize(scheduleData), payloadMode);
  }

  /**
   * Serializes data into a `Subjects` object
   *
   * @param {object} subjectsData - the data being serialized
   * @param {function} model - handles the mapping of the serialized data. Must have a `create`
   * method. Defaults to `Subjects`
   * @returns an instance of `model`
   */
  static subjects(subjectsData, model = Subjects) {
    return model.create(serialize(subjectsData));
  }

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
  static notifications(notificationsData, model = Notification) {
    let notifications = [];

    notifications = _.map(notificationsData.SCC_GET_NOTIF_RESP.NTK_ITEM, (notification) => {
      return model.create(serialize(notification));
    });

    return notifications;
  }

  /**
   * Serializes data into an `Event` object
   *
   * @param {object} eventsData
   * @param {function} model - a function that handles the mapping of the serialized data. It must
   * have a `create` method. Defaults to `NtfEvent`
   * @return {Array<model>} - returns an Array of `model` objects
   */
  static events(eventsData, model = NtfEvent) {
    let events = [];

    events = _.map(eventsData.SCC_NTF_GET_EVENTS_RESP.SCC_NTF_EVENT, evt => {
      return model.create(serialize(evt));
    });

    return events;
  }

}

module.exports = Serializer;
