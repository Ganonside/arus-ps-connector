import _ from 'underscore';

/**
 * @class Fault
 */
class Fault {

  constructor(faultObj) {
    let responseName = Object.keys(faultObj)[0];

    let messages = [];

    try { /* Try to map the Fault normally */
      if (_.isArray(faultObj[responseName].sccFaultResp.detail.msgs.msg)) {
        _.each(faultObj[responseName].sccFaultResp.detail.msgs.msg, (faultMessage) => {
          messages.push(faultMessage);
        });
      } else {
        messages.push(faultObj[responseName].sccFaultResp.detail.msgs.msg);
      }

      this.responseName = responseName;
    }
    catch (err) { /* Accounts for RESTListeningConnector Faults */
      let msgObj = faultObj.html;
      messages.push({
        descr: `${msgObj.head.title} - ${msgObj.body}`
      });

      this.responseName = 'N/A';
    }

    this.faultMessages = messages;
  }
}

export default Fault;
