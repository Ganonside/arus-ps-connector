import _ from 'underscore';

/**
 * The description of this class
 *
 * @class
 */
class Subjects {

  constructor(params) {
    Object.keys(params).map(key => this[key] = params[key]);
  }

  static create(obj) {
    let subjects = [];
    if (_.isArray(obj.ssrGetCoursesResp.courseSearchResult.subjects.subject)) {
      obj.ssrGetCoursesResp.courseSearchResult.subjects.subject.map(subject => {
        subjects.push(new Subject(subject));
      });
    } else {
      subjects.push(new Subject(obj.ssrGetCoursesResp.courseSearchResult.subjects.subject));
    }

    return new Subjects(subjects);
  }
}

class Subject {
  constructor(params) {
    Object.keys(params).map(key => this[key] = params[key]);
  }
}

module.exports = Subjects;
