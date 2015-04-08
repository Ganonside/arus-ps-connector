process.env.NODE_ENV='test';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import config from '../config.js';

import Request from '../lib/js/Request.js';
import ArusPSConnector from '../lib/js/index.js';
import Profile from '../lib/js/models/Profile.js';

chai.should();
chai.use(chaiAsPromised);

describe('Profile', () => {
  console.log(process.env.USERNAME, process.env.PASSWORD);
  console.log(process.env.PROFILE_URL);
  describe('#getProfile', () => {
    let params = {
      url: config.get('getProfileUrl'),
      auth: [config.get('username'), config.get('password')]
    };

    it('should return ok', () => {
      return Request.get(params).should.be.fulfilled;
    });

    it('should return data', () => {
      let resp = new Promise((resolve, reject) => {
        Request.get(params)
          .then(res => {
            resolve(res.data);
          }).catch(err => {
            reject(err);
          });
      });

      return resp.should.not.become(undefined);
    });

    it('should return an instance of Profile', () => {
      return ArusPSConnector.getProfile(params)
        .should.eventually.be.an.instanceof(Profile);
    });

    it('should return an instance of the passed in model', () => {

      class ProfileMock {
        constructor(fields) {
          /* eslint-disable */
          let profile = {
            name: this.name
          } = fields;
          /* eslint-enable */
        }

        static create(obj) {
          let profile = {
            name: obj.sccGetconstResp.constituent.perNames.perName[0].nameDisplay
          };

          return new ProfileMock(profile);
        }
      }

      return ArusPSConnector.getProfile(params, ProfileMock)
        .should.eventually.be.an.instanceof(ProfileMock);
    });

    it('should be rejected with a TypeError', () => {
      return ArusPSConnector.getProfile(params, {})
        .should.be.rejectedWith(TypeError);
    });
  });
});

process.env.NODE_ENV='';
