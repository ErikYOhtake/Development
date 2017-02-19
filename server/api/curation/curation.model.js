'use strict';

import mongoose from 'mongoose';

var CurationSchema = new mongoose.Schema({
  cudt: {type:Date, default: Date.now},
  usid: mongoose.Schema.Types.ObjectId, // user_id
  prid: mongoose.Schema.Types.ObjectId, // product_id
  pere: Number,
  pecm: String,
  nere: Number,
  necm: String,
  crtm: {type:Date, default: Date.now}, // create timestamp
  uptm: Date // update timestamp
});

export default mongoose.model('Curation', CurationSchema);
