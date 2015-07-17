import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import config from '../config.js';

import Request from '../lib/js/Request.js';
import ArusPSConnector from '../lib/js/index.js';
import NtfEvent from '../lib/js/models/NtfEvent.js';
import Fault from '../lib/js/models/Fault.js';

chai.should();
chai.use(chaiAsPromised);

describe('Events', () => {
  describe('#getNotificationEvents', () => {
    let params = {
      url: config.get('getNotificationEventsUrl'),
      auth: [config.get('username'), config.get('password')],
      send: `<SCC_NTF_GET_EVENTS_REQ_R><NUM_PAST_DAYS>10000</NUM_PAST_DAYS><INCLUDE_EVENTS>Y</INCLUDE_EVENTS></SCC_NTF_GET_EVENTS_REQ_R>`
    };

    it('should return ok', () => {
      return Request.post(params).should.be.fulfilled;
    });

    it('should return data', () => {
      let resp = new Promise((resolve, reject) => {
        Request.post(params)
          .then((res) => {
            if (res.data) {
              resolve(res.data);
            } else {
              reject(new Error('\'data\' field was not found in \'res\' object'));
            }
          }).catch(reject);
      });

      return resp.should.not.become(undefined);
    });

    it('should return an instance of NtfEvent', () => {
      let resp = new Promise((resolve, reject) => {
        ArusPSConnector.getNotificationEvents(params)
          .then(res => {
            resolve(res.events[0]);
          }).catch(err => {
            reject(err);
          });
      });

      return resp.should.eventually.be.an.instanceof(NtfEvent);
    });

    it('should return an instance of passed in model', () => {
      class EventMock {
        constructor(fields) {
          let event = {
            desc: this.desc
          } = fields;
        }
        static create(obj) {
          let event = {
            desc: 'Event Mock'
          };

          return new this(event);
        }
      }

      let resp = new Promise((resolve, reject) => {
        ArusPSConnector.getNotificationEvents(params, EventMock)
          .then(res => {
            resolve(res.events[0]);
          }).catch(err => {
            reject(err);
          });
      });

      return resp.should.eventually.be.an.instanceof(EventMock);
    });

    it('should be rejected with a TypeError', () => {
      return ArusPSConnector.getNotificationEvents(params, {})
        .should.be.rejectedWith(TypeError);
    });
  });

  describe('#changeReadStatus', () => {

    let getParams = {
      url: config.get('getNotificationEventsUrl'),
      auth: [config.get('username'), config.get('password')],
      send: `<SCC_NTF_GET_EVENTS_REQ_R><NUM_PAST_DAYS>10000</NUM_PAST_DAYS><INCLUDE_EVENTS>Y</INCLUDE_EVENTS></SCC_NTF_GET_EVENTS_REQ_R>`
    };

    let changeParams;

    let id;
    let oldStatus;
    let newStatus;

    let resp;

    before(function(done) {
      ArusPSConnector.getNotificationEvents(getParams)
        .then((res) => {
          id = res.events[0].id;
          oldStatus = res.events[0].status;

          newStatus = (oldStatus === 'U' ? 'R' : 'U');
          changeParams = {
            url: config.get('markAsReadUrl'),
            auth: [config.get('username'), config.get('password')],
            send: `<SCC_NTF_UPDATE_EVENTS_REQ><NUM_PAST_DAYS>7</NUM_PAST_DAYS><EVENTS><SCC_NTF_EVENT>	<SCC_NTFEVT_REQ_ID>${id}</SCC_NTFEVT_REQ_ID><SCC_NTFEVT_STATUS>${newStatus}</SCC_NTFEVT_STATUS></SCC_NTF_EVENT></EVENTS></SCC_NTF_UPDATE_EVENTS_REQ>`
          };

          resp = new Promise((resolve, reject) => {
            ArusPSConnector.changeReadStatus(changeParams)
              .then((res2) => {
                resolve(res2);
                done();
              }).catch(done);
          });
        }).catch(done);
    });

    it('should return ok', () => {
      return resp.should.be.fulfilled;
    });

    it('should have changed the read status', () => {
      let changedStatus = new Promise((resolve, reject) => {
        ArusPSConnector.getNotificationEvents(getParams)
          .then(res => {
            for (let i = 0; i < res.events.length; ++i) {
              if (res.events[i].id === id) {
                resolve(res.events[i].status);
                break;
              }
            }
          }).catch(reject);
      });

      return changedStatus.should.become(newStatus);
    });

    it('should be rejected with a TypeError', () => {
      return ArusPSConnector.changeReadStatus('')
        .should.be.rejectedWith(TypeError);
    });

    after((done) => {
      changeParams = {
        url: config.get('markAsReadUrl'),
        auth: [config.get('username'), config.get('password')],
        send: `<SCC_NTF_UPDATE_EVENTS_REQ><NUM_PAST_DAYS>7</NUM_PAST_DAYS><EVENTS><SCC_NTF_EVENT>	<SCC_NTFEVT_REQ_ID>${id}</SCC_NTFEVT_REQ_ID><SCC_NTFEVT_STATUS>${oldStatus}</SCC_NTFEVT_STATUS></SCC_NTF_EVENT></EVENTS></SCC_NTF_UPDATE_EVENTS_REQ>`
      };

      ArusPSConnector.changeReadStatus(changeParams)
        .then(() => {
          done();
        }).catch(done);
    });
  });

  describe('Faults', () => {

    describe('Get Events', () => {
      let numPastDays = 'NAN';
      let params = {
        url: config.get('getNotificationEventsUrl'),
        auth: [config.get('username'), config.get('password')],
        send: `<SCC_NTF_GET_EVENTS_REQ_R><NUM_PAST_DAYS>${numPastDays}</NUM_PAST_DAYS><INCLUDE_EVENTS>Y</INCLUDE_EVENTS></SCC_NTF_GET_EVENTS_REQ_R>`
      };

      it('response promise should be fulfilled', () => {
        return Request.post(params).should.eventually.be.fulfilled;
      });

      it('should return data', () => {
        let resp = new Promise((resolve, reject) => {
          Request.post(params)
            .then((res) => {
              resolve(res.data);
            })
            .catch(reject);
        });

        return resp.should.not.become(undefined);
      });

      it('should return an instance of Fault', () => {
        let resp = new Promise((resolve, reject) => {
          ArusPSConnector.getNotificationEvents(params, undefined, numPastDays, 'Y')
            .then(resolve)
            .catch(reject);
        });

        return resp.should.eventually.be.an.instanceof(Fault);
      });

      it.skip('run this to display the response', () => {
        let resp = new Promise((resolve, reject) => {
          ArusPSConnector.getNotificationEvents(params, undefined, numPastDays, 'Y')
            .then((res) => {
              console.log('Result: ', res);
              resolve(res);
            })
            .catch(reject);
        });

        return resp.should.eventually.be.fulfilled;
      });
    });

    describe('Change Read Status', () => {
      let id = -1;
      let status = 'U';
      let numPastDays = 7;
      let params = {
        url: config.get('markAsReadUrl'),
        auth: [config.get('username'), config.get('password')],
        send: `<SCC_NTF_UPDATE_EVENTS_REQ><NUM_PAST_DAYS>${numPastDays}</NUM_PAST_DAYS><EVENTS><SCC_NTF_EVENT>	<SCC_NTFEVT_REQ_ID>${id}</SCC_NTFEVT_REQ_ID><SCC_NTFEVT_STATUS>${status}</SCC_NTFEVT_STATUS></SCC_NTF_EVENT></EVENTS></SCC_NTF_UPDATE_EVENTS_REQ>`
      };

      it('response promise should be fulfilled', () => {
        return Request.post(params).should.eventually.be.fulfilled;
      });

      it('should return data', () => {
        let resp = new Promise((resolve, reject) => {
          Request.post(params)
            .then((res) => {
              resolve(res.data);
            })
            .catch(reject);
        });

        return resp.should.not.become(undefined);
      });

      it('should return an instance of Fault', () => {
        let resp = new Promise((resolve, reject) => {
          ArusPSConnector.changeReadStatus(params, id, status, numPastDays)
            .then(resolve)
            .catch(reject);
        });

        return resp.should.eventually.be.an.instanceof(Fault);
      });

      it.skip('run this to display the response', () => {
        let resp = new Promise((resolve, reject) => {
          ArusPSConnector.changeReadStatus(params, id, status, numPastDays)
            .then((res) => {
              console.log('Result: ', res);
              resolve(res);
            })
            .catch(reject);
        });

        return resp.should.eventually.be.fulfilled;
      });
    });
  });
});
