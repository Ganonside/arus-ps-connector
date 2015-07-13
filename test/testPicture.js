import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import config from '../config.js';

import Request from '../lib/js/Request.js';
import ArusPSConnector from '../lib/js/index.js';
import Picture from '../lib/js/models/Picture.js';
import Fault from '../lib/js/models/Fault.js';

chai.should();
chai.use(chaiAsPromised);

describe('Picture', () => {
  describe('#getPicture', () => {
    let params = {
      url: config.get('getPictureUrl'),
      auth: [config.get('username'), config.get('password')],
      acceptType: 'application/xml'
    };

    it('should return ok', () => {
      return Request.get(params).should.be.fulfilled;
    });

    it('should return data', () => {
      let resp = new Promise((resolve, reject) => {
        Request.get(params)
          .then(res => {
            // console.log(res);
            resolve(res.data);
          }).catch(err => {
            console.log(err);
            reject(err);
          });
      });

      return resp.should.not.become(undefined);
    });

    it('should return an instance of Picture', () => {
      return ArusPSConnector.getPicture(params)
        .should.eventually.be.an.instanceof(Picture);
    });

    it('should return an instance of the passed in model', () => {

      class PictureMock {
        constructor(fields) {
          /* eslint-disable */
          let picture = {
            desc: this.desc,
            base64: this.base64
          } = fields;
          /* eslint-enable */
        }
        static create(obj) {
          let picture = {
            desc: 'Mocked Picture',
            base64: obj.sccGetphotoResp.employeePhoto.base64data
          };

          return new PictureMock(picture);
        }
      }

      return ArusPSConnector.getPicture(params, PictureMock)
        .should.eventually.be.an.instanceof(PictureMock);
    });

    it('should be rejected with a TypeError', () => {
      return ArusPSConnector.getPicture(params, {})
        .should.be.rejectedWith(TypeError);
    });
  });

  describe('Faults', () => {
    /**
     * I don't know how to intentionally cause faults for this service
     */
  });
});
