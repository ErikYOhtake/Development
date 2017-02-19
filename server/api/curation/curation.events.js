/**
 * Curation model events
 */

'use strict';

import {EventEmitter} from 'events';
import Curation from './curation.model';
var CurationEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
CurationEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Curation.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    CurationEvents.emit(event + ':' + doc._id, doc);
    CurationEvents.emit(event, doc);
  };
}

export default CurationEvents;
