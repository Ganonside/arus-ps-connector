import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import config from '../config.js';

import Request from '../lib/js/Request.js';
import ArusPSConnector from '../lib/js/index.js';
import Courses from '../lib/js/models/Courses.js';
import Fault from '../lib/js/models/Fault.js';

chai.should();
chai.use(chaiAsPromised);

describe('Courses', () => {
  describe('#getCourses', () => {
    let institution = 'UCINN', subject = 'OM';

    let params = {
      url: config.get('getCoursesUrl'),
      auth: [config.get('username'), config.get('password')],
      send: `<SSR_GET_COURSES_REQ><COURSE_SEARCH_REQUEST><INSTITUTION>${institution}</INSTITUTION><SUBJECT>${subject}</SUBJECT><SSR_CRS_SRCH_MODE>D</SSR_CRS_SRCH_MODE></COURSE_SEARCH_REQUEST></SSR_GET_COURSES_REQ>`
    };

    it('response promise should be fulfilled', () => {
      return Request.post(params).should.eventually.be.fulfilled;
    });

    it('should return data', () => {
      let resp = new Promise((resolve, reject) => {
        Request.post(params)
          .then(res => {
            resolve(res.data);
          }).catch(reject);
      });

      return resp.should.not.become(undefined);
    });

    it('should return an instance of Courses', () => {
      return ArusPSConnector.getCourses(params, undefined, subject)
        .should.eventually.be.an.instanceof(Courses);
    });

    it('should return an instance of passed in Model', () => {
      class CoursesMock {
        constructor(obj) {
          Object.keys(obj).map(key => this[key] = obj[key]);
        }

        static create(obj) {
          return new CoursesMock({ desc: 'courses mock' });
        }
      }

      return ArusPSConnector.getCourses(params, CoursesMock, subject)
        .should.eventually.be.an.instanceof(CoursesMock);
    });

    it('should be rejected with TypeError', () => {
      return ArusPSConnector.getCourses(Courses, params, subject)
        .should.eventually.be.rejectedWith(TypeError);
    });
  });

  describe('Faults', () => {
    let institution = ' ';
    let subject = 'OM';

    let params = {
      url: config.get('getCoursesUrl'),
      auth: [config.get('username'), config.get('password')],
      send: `<SSR_GET_COURSES_REQ><COURSE_SEARCH_REQUEST><INSTITUTION>${institution}</INSTITUTION><SUBJECT>${subject}</SUBJECT><SSR_CRS_SRCH_MODE>D</SSR_CRS_SRCH_MODE></COURSE_SEARCH_REQUEST></SSR_GET_COURSES_REQ>`
    };

    it('response promise should be fulfilled', () => {
      return Request.post(params).should.eventually.be.fulfilled;
    });

    it('should return data', () => {
      let resp = new Promise((resolve, reject) => {
        Request.post(params)
          .then(res => {
            resolve(res.data);
          }).catch(reject);
      });

      return resp.should.not.become(undefined);
    });

    it('should return an instance of Fault', () => {
      return ArusPSConnector.getCourses(params, undefined, subject, false, '')
        .should.eventually.be.an.instanceof(Fault);
    });

    it.skip('should display the fault', () => {
      let resp = new Promise((resolve, reject) => {
        ArusPSConnector.getCourses(params, undefined, subject, false, '')
          .then((res) => {
            console.log('Result: ', res);
            resolve(res);
          }).catch(reject);
      });

      return resp.should.eventually.be.fulfilled;
    });
  });
});
