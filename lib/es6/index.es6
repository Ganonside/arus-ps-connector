import { parseString } from 'xml2js';
import { getCached, setCached } from './cache.js';

import Request from './Request.js';
import Serializer from './Serializer.js';

/**
 * Checks if a response object is a Fault and returns it if it is
 */
let interceptFault = (resp) => {
  /* gets the response's 2nd-level node */
  let body = resp[Object.keys(resp)[0]];

  if (body.IS_FAULT && body.IS_FAULT[0] && body.IS_FAULT[0] === 'Y') {
    // return resp if it's a Fault
    return resp;
  } else {
    // return false if resp isn't a Fault
    return false;
  }
};

// TODO: update jsdoc
let ArusPSConnector = {

  /**
   * Retrieves Profile information.
   *
   * @method getProfile
   * @static
   * @params {Object} requestParams - an object containing the fields needed to
   * build your remote request
   * @example
   * {
   *   url: 'someUrl',
   *   auth: ['username', 'password'],
   *   acceptType: 'application/json',
   *   send: dataToSend,
   *   headers: objectContainingHeaders
   * }
   * @return {Promise} - returns a Promise of a serialized remote request response
   */
  getProfile(requestParams, model, useCache = true) {

    let cachedProfile = getCached('profile');

    if (typeof useCache !== 'boolean') {
      return Promise.reject(new TypeError(`Type of useCache is ${typeof useCache}. Expected a booloean\n\tuseCache = ${useCache}`));
    } else if (cachedProfile && useCache) {
      return Promise.resolve(cachedProfile);
    }

    let defaults;
    try {
      defaults = {
        url: __PROFILE_URL__,
        auth: [__USERNAME__, __PASSWORD__],
        headers: undefined
      };
    } catch (err) {
      defaults = {
        url: process.env.PROFILE_URL,
        auth: [process.env.USERNAME, process.env.PASSWORD],
        headers: undefined
      };
    }

    let params = defaults;
    if (requestParams) {
      Object.keys(defaults).map(key => params[key] = requestParams[key] || defaults[key]);
    }

    if (typeof params !== 'object') {
      return Promise.reject(new TypeError(`Type of params is ${typeof params}. Expected an object\n\tparams = ${params}`));
    } else if (model !== undefined && typeof model !== 'function') {
      return Promise.reject(new TypeError(`Type of model is ${typeof model}. Expected a function\n\tmodel = ${model}`));
    }

    return new Promise((resolve, reject) => {
      Request.get(params)
        .then(res => {

          let jRes;
          parseString(res.data, (err, parsedRes) => {
            if (!err) {
              jRes = parsedRes;
            } else {
              reject(err);
            }
          });

          // Serialize the http response to a profile
          let profile = Serializer.profile(jRes, model);

          resolve(profile);
        }).catch(err => {
          reject(err);
        });
    });
  },

  /**
   * Retrieves a Profile Picture
   *
   * @method getPicture
   * @static
   * @params {Object} requestParams - an object containing the fields needed to
   * build the remote request
   * @example
   * {
   *   url: 'someUrl',
   *   auth: ['username', 'password'],
   *   acceptType: 'application/json',
   *   send: dataToSend,
   *   headers: objectContainingHeaders
   * }
   * @return {Promise} - returns a Promise of a serialized remote request response
   */
  getPicture(requestParams, model, useCache = true) {

    let cachedPicture = getCached('picture');

    if (typeof useCache !== 'boolean') {
      return Promise.reject(new TypeError(`Type of useCache is ${typeof useCache}. Expected a boolean\n\tuseCache = ${useCache}`));
    } else if (useCache && cachedPicture) {
      return Promise.resolve(cachedPicture);
    }

    let defaults;
    try {
      defaults = {
        url: __PICTURE_URL__,
        auth: [__USERNAME__, __PASSWORD__],
        headers: undefined
      };
    } catch (err) {
      defaults = {
        url: process.env.PICTURE_URL,
        auth: [process.env.USERNAME, process.env.PASSWORD],
        headers: undefined
      };
    }

    let params = defaults;
    if (requestParams) {
      Object.keys(defaults).map(key => params[key] = requestParams[key] || defaults[key]);
    }

    if (typeof params !== 'object') {
      return Promise.reject(new TypeError(`Type of params is ${typeof params}. Expected an object\n\tparams = ${params}`));
    } else if (model !== undefined && typeof model !== 'function') {
      return Promise.reject(new TypeError(`Type of model is ${typeof model}. Expected a function\n\tmodel = ${model}`));
    }

    return new Promise((resolve, reject) => {
      Request.get(params)
        .then(res => {

          let jRes;
          parseString(res.data, (err, parsedRes) => {
            if (!err) {
              jRes = parsedRes;
            } else {
              reject(err);
            }
          });

          let picture = Serializer.picture(jRes, model);

          resolve(picture);
        }).catch(err => {
          reject(err);
        });
    });
  },

  /**
   * Retrieves Schedule info
   *
   * @method getSchedule
   * @static
   * @params {Object} requestParams - an object containing the fields needed to build the remote
   * request
   * @params {Num} ssrEnrlGetMode - specifies the format the data will come back in; must be 1, 2,
   * or 3 and defaults to 1
   * @return {Promise} - returns a Promise of a serialized remote request response
   */
  getSchedule(requestParams, model, ssrEnrlGetMode = 1, acadCareer = 'UGRD') {

    let defaults;
    try {
      defaults = {
        url: __SCHEDULE_URL__,
        auth: [__USERNAME__, __PASSWORD__],
        send: undefined,
        headers: undefined
      };
    } catch (err) {
      defaults = {
        url: process.env.SCHEDULE_URL,
        auth: [process.env.USERNAME, process.env.PASSWORD],
        send: undefined,
        headers: undefined
      };
    }

    let params = defaults;
    if (requestParams) {
      Object.keys(defaults).map(key => params[key] = requestParams[key] || defaults[key]);
    }

    if (params.send) {
      // Making sure that ssrEnrlGetMode is the same as the one that was sent in the request
      let modeRe = /<SSR_ENRL_GET_MODE>([1-3])<\/SSR_ENRL_GET_MODE>/;
      /* eslint-disable */
      ssrEnrlGetMode = modeRe.exec(params.send)[1];
      /* eslint-enable */
    } else {
      params.send = `<SSR_GET_ENROLLMENT_REQ><SCC_ENTITY_INST_ID></SCC_ENTITY_INST_ID><EMPLID></EMPLID><ACAD_CAREER>${acadCareer}</ACAD_CAREER><INSTITUTION>UCINN</INSTITUTION><STRM></STRM><SSR_ENRL_GET_MODE>${ssrEnrlGetMode}</SSR_ENRL_GET_MODE></SSR_GET_ENROLLMENT_REQ>`;
    }

    if (typeof params !== 'object') {
      return Promise.reject(new TypeError(`Type of params is ${typeof params}. Expected an object\n\tparams = ${params}`));
    } else if (model !== undefined && typeof model !== 'function') {
      return Promise.reject(new TypeError(`Type of model is ${typeof model}. Expected a function\n\tmodel = ${model}`));
    } else if (typeof ssrEnrlGetMode !== 'string') {
      return Promise.reject(new TypeError(`Type of ssrEnrlGetMode is ${typeof ssrEnrlGetMode}. Expected a string\n\tssrEnrlGetMode = ${ssrEnrlGetMode}`));
    } else if (typeof acadCareer !== 'string') {
      return Promise.reject(new TypeError(`Type of acadCareer is ${typeof acadCareer}. Expected a string\n\tacadCareer = ${acadCareer}`));
    }

    return new Promise((resolve, reject) => {
      Request.post(params)
        .then(res => {

          let jRes;
          parseString(res.data, (err, parsedRes) => {
            if (!err) {
              jRes = parsedRes;
            } else {
              reject(err);
            }
          });

          let schedule = Serializer.schedule(jRes, ssrEnrlGetMode, model);

          resolve(schedule);
        }).catch(err => {
          reject(err);
        });
    });
  },

  /**
   * Retrieves Subjects
   *
   * @method getSubjects
   * @static
   */
  getSubjects(requestParams, model, useCache = true, institution = 'UCINN', subject = '') {

    let cachedPicture = getCached('subjects', institution);

    if (typeof useCache !== 'boolean') {
      return Promise.reject(new TypeError(`Type of useCache is ${typeof useCache}. Expected a boolean\n\tuseCache = ${useCache}`));
    } else if (useCache && cachedPicture) {
      return Promise.resolve(cachedPicture);
    }

    if (typeof requestParams !== 'object') {
      return Promise.reject(new TypeError(`Type of requestParams is ${typeof requestParams}. Expected an object\n\trequestParams = ${requestParams}`));
    } else if (model !== undefined && typeof model !== 'function') {
      return Promise.reject(new TypeError(`Type of model is ${typeof model}. Expected a function\n\tmodel = ${model}`));
    }

    let defaults;
    try {
      defaults = {
        url: __SUBJECTS_URL__,
        auth: [__USERNAME__, __PASSWORD__],
        send: undefined,
        headers: undefined
      };
    } catch (err) {
      defaults = {
        url: process.env.SUBJECTS_URL,
        auth: [process.env.USERNAME, process.env.PASSWORD],
        send: undefined,
        headers: undefined
      };
    }

    let params = defaults;
    if (requestParams) {
      Object.keys(defaults).map(key => params[key] = requestParams[key] || defaults[key]);
    }

    if (!params.send) {
      params.send = `<SSR_GET_COURSES_REQ><COURSE_SEARCH_REQUEST><INSTITUTION>${institution}</INSTITUTION><SUBJECT>${subject}</SUBJECT><SSR_CRS_SRCH_MODE>H</SSR_CRS_SRCH_MODE></COURSE_SEARCH_REQUEST></SSR_GET_COURSES_REQ>`;
    }

    return new Promise((resolve, reject) => {
      Request.post(requestParams)
        .then(res => {

          let jRes;
          parseString(res.data, (err, parsedRes) => {
            if (!err) {
              jRes = parsedRes;
            } else {
              reject(err);
            }
          });

          let subjects = Serializer.subjects(jRes, model);

          resolve(subjects);
        }).catch(err => {
          reject(err);
        });
    });
  },

  getCourses(requestParams, model, subject, useCache = true, institution = 'UCINN') {

    if (typeof subject !== 'string') {
      return Promise.reject(new TypeError(`Type of subject is ${typeof subject}. Expected a string\n\tsubject = ${subject}`));
    }

    let cachedPicture = getCached(['courses', institution, subject]);

    if (typeof useCache !== 'boolean') {
      return Promise.reject(new TypeError(`Type of useCache is ${typeof useCache}. Expected a boolean\n\tuseCache = ${useCache}`));
    } else if (useCache && cachedPicture) {
      return Promise.resolve(cachedPicture);
    }

    if (typeof requestParams !== 'object') {
      return Promise.reject(new TypeError(`Type of requestParams is ${typeof requestParams}. Expected an object\n\trequestParams = ${requestParams}`));
    } else if (model !== undefined && typeof model !== 'function') {
      return Promise.reject(new TypeError(`Type of model is ${typeof model}. Expected a function\n\tmodel = ${model}`));
    }

    let defaults;
    try {
      defaults = {
        url: __COURSES_URL__,
        auth: [__USERNAME__, __PASSWORD__],
        send: undefined,
        headers: undefined
      };
    } catch (err) {
      defaults = {
        url: process.env.COURSES_URL,
        auth: [process.env.USERNAME, process.env.PASSWORD],
        send: undefined,
        headers: undefined
      };
    }

    let params = defaults;
    if (requestParams) {
      Object.keys(defaults).map(key => params[key] = requestParams[key] || defaults[key]);
    }

    if (!params.send) {
      params.send = `<SSR_GET_COURSES_REQ><COURSE_SEARCH_REQUEST><INSTITUTION>${institution}</INSTITUTION><SUBJECT>${subject}</SUBJECT><SSR_CRS_SRCH_MODE>D</SSR_CRS_SRCH_MODE></COURSE_SEARCH_REQUEST></SSR_GET_COURSES_REQ>`;
    }

    return new Promise((resolve, reject) => {
      Request.post(params)
        .then(res => {

          let jRes;
          parseString(res.data, (err, parsedRes) => {
            if (!err) {
              jRes = parsedRes;
            } else {
              reject(err);
            }
          });

          let fault = interceptFault(jRes);
          if (fault) {
            resolve(Serializer.fault(jRes));
          } else {
            let courses = Serializer.courses(jRes, model);
            resolve(courses);
          }
        }).catch(reject);
    });
  },

  /**
   * Retrieves Notification info
   *
   * @method getNotifications
   * @static
   * @params {Object} requestParams - an object containing the fields needed to build the remote
   * request
   * @return {Promise} - returns a Promise of a serialized remote request response
   */
  getNotifications(requestParams, model) {

    let defaults;
    try {
      defaults = {
        url: __NOTIFICATIONS_URL__,
        auth: [__USERNAME__, __PASSWORD__],
        send: undefined,
        headers: undefined
      };
    } catch (err) {
      defaults = {
        url: process.env.NOTIFICATIONS_URL,
        auth: [process.env.USERNAME, process.env.PASSWORD],
        send: undefined,
        headers: undefined
      };
    }

    let params = defaults;
    if (requestParams) {
      Object.keys(defaults).map(key => params[key] = requestParams[key] || defaults[key]);
    }

    if (!params.send) {
      params.send = `<SCC_GET_NOTIF_REQ><EMPLID></EMPLID></SCC_GET_NOTIF_REQ>`;
    }

    if (typeof params !== 'object') {
      return Promise.reject(new TypeError(`Type of params is ${typeof params}. Expected an object\n\tparams = ${params}`));
    } else if (model !== undefined && typeof model !== 'function') {
      return Promise.reject(new TypeError(`Type of model is ${typeof model}. Expected a function\n\tmodel = ${model}`));
    }

    return new Promise((resolve, reject) => {
      Request.post(params)
        .then(res => {

          let jRes;
          parseString(res.data, (err, parsedRes) => {
            if (!err) {
              jRes = parsedRes;
            } else {
              reject(err);
            }
          });

          let notifications = Serializer.notifications(jRes, model);

          resolve(notifications);
        }).catch(err => {
          reject(err);
        });
    });
  },

  /**
   * Retrieves Notification Event info
   *
   * @method getNotificationEvents
   * @static
   * @params {Object} requestData - an object containing the fields needed to create the remote
   * request
   * @return {Promise} - returns a Promise of the serialized remote request response
   */
  getNotificationEvents(requestParams, model, numDaysPast = 10000, includeEvents = 'Y') {

    let defaults;
    try {
      defaults = {
        url: __EVENTS_URL__,
        auth: [__USERNAME__, __PASSWORD__],
        send: undefined,
        headers: undefined
      };
    } catch (err) {
      defaults = {
        url: process.env.EVENTS_URL,
        auth: [process.env.USERNAME, process.env.PASSWORD],
        send: undefined,
        headers: undefined
      };
    }

    let params = defaults;
    if (requestParams) {
      Object.keys(defaults).map(key => params[key] = requestParams[key] || defaults[key]);
    }

    if (!params.send) {
      if (typeof numDaysPast !== 'number') {
        return Promise.reject(new TypeError(`Type of numDaysPast is ${typeof numDaysPast}. Expected a number\n\tnumDaysPast = ${numDaysPast}`));
      } else if (typeof includeEvents !== 'string') {
        return Promise.reject(new TypeError(`Type of includeEvents is ${typeof includeEvents}. Expected a string\n\tincludeEvents = ${includeEvents}`));
      }

      params.send = `<SCC_NTF_GET_EVENTS_REQ_R><NUM_PAST_DAYS>${numDaysPast}</NUM_PAST_DAYS><INCLUDE_EVENTS>${includeEvents}</INCLUDE_EVENTS></SCC_NTF_GET_EVENTS_REQ_R>`;
    }

    if (typeof params !== 'object') {
      return Promise.reject(new TypeError(`Type of params is ${typeof params}. Expected an object\n\tparams = ${params}`));
    } else if (model !== undefined && typeof model !== 'function') {
      return Promise.reject(new TypeError(`Type of model is ${typeof model}. Expected a function\n\tmodel = ${model}`));
    }

    return new Promise((resolve, reject) => {
      Request.post(params)
        .then(res => {
          let jRes;
          parseString(res.data, (err, parsedRes) => {
            if (!err) {
              jRes = parsedRes;
            } else {
              reject(err);
            }
          });

          let eventCounts = Serializer.eventsCount(jRes, model);
          let events = Serializer.events(jRes, model);

          let resp = { eventCounts: eventCounts, events: events};


          resolve(resp);
        }).catch(err => {
          reject(err);
        });
    });
  },

  /**
   * Marks a notification as read
   *
   * @method changeReadStatus
   * @static
   * @params {Object} requestParams - an object containing the fields needed to create the remote
   * request
   */
  changeReadStatus(requestParams, id, status, numDaysPast = 7) {

    let defaults;
    try {
      defaults = {
        url: __MARK_AS_READ_URL__,
        auth: [__USERNAME__, __PASSWORD__],
        send: undefined,
        headers: undefined
      };
    } catch (err) {
      defaults = {
        url: process.env.MARK_AS_READ_URL,
        auth: [process.env.USERNAME, process.env.PASSWORD],
        send: undefined,
        headers: undefined
      };
    }

    let params = defaults;
    if (requestParams) {
      Object.keys(defaults).map(key => params[key] = requestParams[key] || defaults[key]);
    }

    if (!params.send) {
      if (typeof id !== 'number') {
        return Promise.reject(new TypeError(`Type of id is ${typeof id}. Expected an number\n\tid = ${id}`));
      } else if (typeof status !== 'string') {
        return Promise.reject(new TypeError(`Type of status is ${typeof status}. Expected an string\n\tstatus = ${status}`));
      } else if (typeof numDaysPast !== 'number') {
        return Promise.reject(new TypeError(`Type of numDaysPast is ${typeof numDaysPast}. Expected an number\n\tnumDaysPast = ${numDaysPast}`));
      }

      params.send = `<SCC_NTF_UPDATE_EVENTS_REQ><NUM_PAST_DAYS>${numDaysPast}</NUM_PAST_DAYS><EVENTS><SCC_NTF_EVENT><SCC_NTFEVT_REQ_ID>${id}</SCC_NTFEVT_REQ_ID><SCC_NTFEVT_STATUS>${status}</SCC_NTFEVT_STATUS></SCC_NTF_EVENT></EVENTS></SCC_NTF_UPDATE_EVENTS_REQ>`;
    }

    if (typeof params !== 'object') {
      return Promise.reject(new TypeError(`Type of params is ${typeof params}. Expected an object\n\tparams = ${params}`));
    }

    return new Promise((resolve, reject) => {
      Request.post(params)
        .then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
    });
  },

  //TODO: update docs below
  /**
   * Retrieves a Profile Picture
   *
   * @method getPicture
   * @static
   * @params {Object} requestParams - an object containing the fields needed to
   * build the remote request
   * @example
   * {
   *   url: 'someUrl',
   *   auth: ['username', 'password'],
   *   acceptType: 'application/json',
   *   send: dataToSend,
   *   headers: objectContainingHeaders
   * }
   * @return {Promise} - returns a Promise of a serialized remote request response
   */
  UCIDLookup(requestParams, searchTerm, model) {

    let defaults;
    try {
      defaults = {
        url: __LOOKUP_UCID_URL__ + searchTerm,
        auth: [__USERNAME__, __PASSWORD__],
        headers: undefined
      };
    } catch (err) {
      defaults = {
        url: process.env.LOOKUP_UCID_URL + searchTerm,
        auth: [process.env.USERNAME, process.env.PASSWORD],
        headers: undefined
      };
    }

    let params = defaults;

    return new Promise((resolve, reject) => {
      Request.get(params)
        .then(res => {

          let jRes;
          parseString(res.data, (err, parsedRes) => {
            if (!err) {
              jRes = parsedRes;
            } else {
              reject(err);
            }
          });

          let emplid = Serializer.UCIDLookup(jRes, model);
          resolve(emplid);
        }).catch(err => {
          reject(err);
        });
    });
  },

  getLovs(requestParams, model, lovParams) {

    let defaults;
    try {
      defaults = {
        url: __LOV_URL__,
        auth: [__USERNAME__, __PASSWORD__],
        send: undefined,
        headers: undefined
      };
    } catch (err) {
      defaults = {
        url: process.env.LOV_URL,
        auth: [process.env.USERNAME, process.env.PASSWORD],
        send: undefined,
        headers: undefined
      };
    }

    let params = defaults;
    if (requestParams) {
      Object.keys(defaults).map(key => params[key] = requestParams[key] || defaults[key]);
    }

    if (!params.send) {
      if (!Array.isArray(lovParams)) {
        return Promise.reject(new TypeError(`Type of lovParams is ${typeof lovParams}. Expected an Array\n\tlovParams = ${lovParams}`));
      }

      let lovsStr = '<LOVS>';
      for (let i = 0; i < lovParams.length; ++i) {
        let { lovName, fieldname, recordname, keys, sortby, sortorder, maxcount } = lovParams[i];

        let keysStr = '';
        if (keys) {
          if (!Array.isArray(keys)) {
            return Promise.reject(new TypeError(`Type of keys is ${typeof keys}. Expected an Array\n\tkeys = ${keys}`));
          }

          for (let j = 0; j < keys.length; ++j) {
            keysStr += `<KEY><FIELDNAME>${keys[j].fieldname}</FIELDNAME><FIELDVALUE>${keys[j].fieldvalue}</FIELDVALUE></KEY>`;
          }
          if (keysStr !== '') {
            keysStr = `<KEYS>${keysStr}</KEYS>`;
          }
        }

        lovsStr += `
          <LOV name='${lovName || fieldname}' sortby='${sortby || 'CODE'}' sortorder='${sortorder || 'ASC'}' maxcount='${maxcount || 1000}'>
            <FIELDNAME>${fieldname}</FIELDNAME>
            <RECORDNAME>${recordname}</RECORDNAME>
            ${keysStr}
          </LOV>`;
      }
      lovsStr += '</LOVS>';

      params.send = `
        <SCC_LOV_REQ>
          ${lovsStr}
        </SCC_LOV_REQ>`;
    }

    return new Promise((resolve, reject) => {
      Request.post(params)
        .then(res => {
          let jRes;
          parseString(res.data, (err, parsedRes) => {
            if (!err) {
              jRes = parsedRes;
            } else {
              reject(err);
            }
          });

          let lov = Serializer.lovs(jRes, model);

          resolve(lov);
        })
        .catch(reject);
    });
  }
};

module.exports = ArusPSConnector;
