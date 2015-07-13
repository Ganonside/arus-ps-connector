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

    it('response promise should be fulfilled', function(done) {
      this.timeout(25000);

      let resp = new Promise((resolve, reject) => {
        Request.post(params)
          .then(resolve)
          .catch(reject);
      });

      resp.should.eventually.be.fulfilled.and.notify(done);
    });

    it('should return data', function(done) {
      this.timeout(25000);

      let resp = new Promise((resolve, reject) => {
        Request.post(params)
          .then((res) => {
            if (res.data) {
              resolve(res.data);
            } else {
              reject(new Error('\'data\' field was not found in \'res\' object'));
            }
          })
          .catch(done);
      });

      resp.should.eventually.be.fulfilled.and.notify(done);
    });

    it('should return an instance of Subjects', function(done) {
      this.timeout(25000);

      ArusPSConnector.getSubjects(params)
        .should.eventually.be.an.instanceof(Subjects).and.notify(done);
    });

    it('should return an instance of passed in Model', function(done) {
      this.timeout(25000);

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

      ArusPSConnector.getSubjects(params, SubjectsMock)
        .should.eventually.be.an.instanceof(SubjectsMock).and.notify(done);
    });

    it('should reject with TypeError', () => {
      return ArusPSConnector.getSubjects(Subjects, params)
        .should.eventually.be.rejectedWith(TypeError);
    });
  });
});
