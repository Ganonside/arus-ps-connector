import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import config from '../config.js';

import Request from '../lib/js/Request.js';
import ArusPSConnector from '../lib/js/index.js';
import Lov from '../lib/js/models/Lov.js';
import Fault from '../lib/js/models/Fault.js';

let should = chai.should();
chai.use(chaiAsPromised);

describe('Lov', () => {
  let params = {
    url: config.get('getLovUrl'),
    auth: [config.get('username'), config.get('password')]
  };

  describe('getLovs', () => {
    let lovs = [{
      recordname: 'TERM_TBL',
      fieldname: 'STRM',
      sortby: 'CODE',
      sortorder: 'ASC',
      maxcount: 300
    }, {
      lovName: 'CreditLevel',
      recordname: 'ACAD_CAR_TBL',
      fieldname: 'ACAD_CAREER'
    }];

    it('should be fulfilled', () => {
      let resp = new Promise((resolve, reject) => {
        ArusPSConnector.getLovs(params, Lov, lovs)
          .then(resolve)
          .catch((err) => {
            console.log(err.stack);
          });
      });

      return resp.should.be.fulfilled;
    });

    it('should return data', () => {
      let resp = new Promise((resolve, reject) => {
        ArusPSConnector.getLovs(params, Lov, lovs)
          .then(resolve)
          .catch(reject);
      });

      return resp.should.not.become(undefined);
    });

    it('should return an array of instances of Lov', () => {
      let resp = new Promise((resolve, reject) => {
        ArusPSConnector.getLovs(params, Lov, lovs)
          .then((res) => {
            resolve(res[0]);
          })
          .catch(reject);
      });

      return resp.should.eventually.be.an.instanceof(Lov);
    });
  });

  describe('Faults', () => {
    describe('Get Lovs', () => {
      let params = {
        url: config.get('getLovUrl'),
        auth: [config.get('username'), config.get('password')]
      };

      let lovParams = [{
        recordname: 'TERM', /* This Record DOESN'T exist */
        fieldname: 'STRM',
        sortby: 'CODE',
        sortorder: 'ASC',
        maxcount: 300
      }];

      it('response promise should be fulfilled', () => {
        let resp = new Promise((resolve, reject) => {
          ArusPSConnector.getLovs(params, Lov, lovParams)
            .then(resolve)
            .catch(reject);
        });

        return resp.should.eventually.be.fulfilled;
      });

      it('should return an instance of Fault', () => {
        let resp = new Promise((resolve, reject) => {
          ArusPSConnector.getLovs(params, Lov, lovParams)
            .then(resolve)
            .catch(reject);
        });

        return resp.should.eventually.be.an.instanceof(Fault);
      });

      it.skip('run this to display response', () => {
        let resp = new Promise((resolve, reject) => {
          ArusPSConnector.getLovs(params, Lov, lovParams)
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
