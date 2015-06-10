/**
 * Serves as the model for NtfEvent data
 *
 * @class
 */
class NtfEvents {

  constructor(eventData) {
    /* eslint-disable */
    let fields = {
    /* eslint-enable */
      totalEventsCount: this.totalEventsCount,
      readEventsCount: this.readEventsCount,
      unreadEventsCount: this.unreadEventsCount
    } = eventData;
  }

  static create(obj) {
    let ntfEvents = {
      totalEventsCount: obj.totalEventsCount,
      readEventsCount: obj.readEventsCount,
      unreadEventsCount: obj.unreadEventsCount
    };

    return new NtfEvents(ntfEvents);
  }
}

module.exports = NtfEvents;
