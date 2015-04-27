import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import config from '../config.js';

import Request from '../lib/js/Request.js';
import ArusPSConnector from '../lib/js/index.js';
import Subjects from '../lib/js/models/Subjects.js';

let expect = chai.expect;
chai.should();
chai.use(chaiAsPromised);

describe('Subjects', () => {
  describe('#getSubjects', () => {
    let institution = 'UCINN', subject = '';

    let params = {
      url: config.get('getSubjectsUrl'),
      auth: [config.get('username'), config.get('password')],
      send: `<SSR_GET_COURSES_REQ><COURSE_SEARCH_REQUEST><INSTITUTION>${institution}</INSTITUTION><SUBJECT>${subject}</SUBJECT><SSR_CRS_SRCH_MODE>H</SSR_CRS_SRCH_MODE></COURSE_SEARCH_REQUEST></SSR_GET_COURSES_REQ>`
    };

    it('response promise should be fulfilled', () => {

      let resp = new Promise((resolve, reject) => {
        Request.post(params)
          .then(res => {
            resolve(res);
          }).catch(reject);
      });

      return resp.should.eventually.be.fulfilled;
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

    it('should return an instance of Subjects', () => {
      return ArusPSConnector.getSubjects(params)
        .should.eventually.be.an.instanceof(Subjects);
    });

    it('should return an instance of passed in Model', () => {
      class SubjectsMock {
        constructor(obj) {
          Object.keys(obj).map(key => this[key] = obj[key]);
        }

        static create(obj) {
          let subjectsData = {
            desc: 'mocked subjects'
          };

          return new SubjectsMock(subjectsData);
        }
      }

      return ArusPSConnector.getSubjects(params, SubjectsMock)
        .should.eventually.be.an.instanceof(SubjectsMock);
    });

    it('should reject with TypeError', () => {
      return ArusPSConnector.getSubjects(Subjects, params)
        .should.eventually.be.rejectedWith(TypeError);
    });
  });
});
