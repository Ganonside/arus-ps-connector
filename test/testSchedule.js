import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import config from '../config.js';

import Request from '../lib/js/Request.js';
import ArusPSConnector from '../lib/js/index.js';
import Schedule from '../lib/js/models/Schedule.js';
import Fault from '../lib/js/models/Fault.js';

chai.should();
chai.use(chaiAsPromised);

describe('Schedule', () => {
  describe('#getSchedule', () => {
    let mode = 1;

    let params = {
      url: config.get('getScheduleUrl'),
      auth: [config.get('username'), config.get('password')],
      send: `<SSR_GET_ENROLLMENT_REQ><SCC_ENTITY_INST_ID></SCC_ENTITY_INST_ID><EMPLID></EMPLID><ACAD_CAREER>UGRD</ACAD_CAREER><INSTITUTION>UCINN</INSTITUTION><STRM></STRM><SSR_ENRL_GET_MODE>${mode}</SSR_ENRL_GET_MODE></SSR_GET_ENROLLMENT_REQ>`,
      acceptType: 'application/xml'
    };

    it('should return ok', function(done) {
      this.timeout(3000);

      return Request.post(params).should.eventually.be.fulfilled
        .and.notify(done);
    });

    it('should return data', function(done) {
      this.timeout(3000);

      let resp = new Promise((resolve, reject) => {
        Request.post(params)
          .then(res => {
            resolve(res.data);
          }).catch(err => {
            reject(err);
          });
      });

      return resp.should.not.become(undefined)
        .and.notify(done);
    });

    it('should return instance of Schedule', function(done) {
      this.timeout(3000);

      return ArusPSConnector.getSchedule(params)
        .should.eventually.be.an.instanceof(Schedule)
        .and.notify(done);
    });

    it('should return an instance of passed in model', function(done) {
      this.timeout(3000);

      class ScheduleMock {
        contructor(fields) {
          /* eslint-disable */
          let schedule = {
            desc: this.desc,
            terms: this.terms
          } = fields;
          /* eslint-enable */
        }

        static create(obj) {
          let schedule = {
            desc: 'Mocked Schedule',
            terms: ['mockTerm1', 'mockTerm2']
          };

          return new ScheduleMock(schedule);
        }
      }

      return ArusPSConnector.getSchedule(params, ScheduleMock, mode)
        .should.eventually.be.an.instanceof(ScheduleMock)
        .and.notify(done);
    });

    it('should be rejected with a TypeError', () => {
      return ArusPSConnector.getSchedule(params, mode)
        .should.be.rejectedWith(TypeError);
    });
  });

  describe('Faults', () => {
    let mode = '';
    let acadCareer = 'UGD';

    let params = {
      url: config.get('getScheduleUrl'),
      auth: [config.get('username'), config.get('password')]
    };

    it('response promise should be fulfilled', () => {
      return Request.post(params).should.eventually.be.fulfilled;
    });

    it('should return data', () => {
      let resp = new Promise((resolve, reject) => {
        Request.post(params)
          .then((res) => {
            resolve(res.data);
          }).catch(reject);
      });

      return resp.should.not.become(undefined);
    });

    it('should return an instance of Fault', () => {
      return ArusPSConnector.getSchedule(params, undefined, mode, acadCareer)
        .should.eventually.be.an.instanceof(Fault);
    });

    it.skip('run this to display the response', () => {
      let resp = new Promise((resolve, reject) => {
        ArusPSConnector.getSchedule(params, undefined, mode, acadCareer)
          .then((res) => {
            console.log('Result: ', res);
            resolve(res);
          }).catch(reject);
      });

      return resp.should.eventually.be.fulfilled;
    });
  });
});
