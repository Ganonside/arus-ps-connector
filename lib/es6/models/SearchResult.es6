import R, { __ as _ } from 'ramda';

export default class SearchResult {

  constructor() {
    this.objName = 'new SearchResult object';
  }

  static create(searchResultResp) {
    console.log(searchResultResp.ssrGetClassesResp.searchResult.subjects);

    let searchResult = {
      errorWarnText: searchResultResp.ssrGetClassesResp.searchResult.errorWarnText,
      wrnLmtExceed: searchResultResp.ssrGetClassesResp.searchResult.ssrWrnLmtExceed,
      errLmtExceed: searchResultResp.ssrGetClassesResp.searchResult.ssrErrLmtExceed,
      courseCount: searchResultResp.ssrGetClassesResp.searchResult.ssrCourseCount,
      classCount: searchResultResp.ssrGetClassesResp.searchResult.ssrClassCount,
      results: []
    };

    if (Array.isArray(searchResultResp.ssrGetClassesResp.searchResult.subjects)) {
      R.forEach((subject) => {
        searchResult.results.push(subject);
      }, searchResultResp.ssrGetClassesResp.searchResult.subjects);
    }

    console.log('searchResult: ', searchResult.results);

    return new this();
  }
}
