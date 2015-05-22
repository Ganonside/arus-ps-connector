import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import R from 'ramda';
import config from '../config.js';

import Request from '../lib/js/Request.js';
import ArusPSConnector from '../lib/js/index.js';
import SearchResult from '../lib/js/models/SearchResult.js';

chai.should();
chai.use(chaiAsPromised);

describe('Search Classes', () => {
  describe.only('#searchClasses', () => {
    let searchParams = {
      strm: 2148,
      sessionCode: undefined,
      descr: '',
      subject: '',
      campus: '',
      acadCareer: undefined
    };

    let params = {
      url: config.get('classSearchUrl'),
      auth: [config.get('username'), config.get('password')]
    };

    it('response promise should be fulfilled', () => {
      let tempParams = R.clone(params);
      tempParams.send = '<SSR_GET_CLASSES><CLASS_SEARCH_REQUEST><INSTITUTION>UCINN</INSTITUTION><STRM>2148</STRM></CLASS_SEARCH_REQUEST></SSR_GET_CLASSES>';

      return Request.post(tempParams).should.be.fulfilled;
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

    it('should return an instance of SearchResult', () => {
      return ArusPSConnector.searchClasses(params, undefined, searchParams)
        .should.eventually.be.an.instanceof(SearchResult);
    });

    it.skip('should not return an instance of Fault', () => {

    });
  });
});
