'use strict';

import mongoose from 'mongoose';

var TradeSchema = new mongoose.Schema({
  trdt: {type:Date, default: Date.now}, // trade_date
  seid: mongoose.Schema.Types.ObjectId, // seller_id
  buid: mongoose.Schema.Types.ObjectId, // buyer_id
  prid: mongoose.Schema.Types.ObjectId, // product_id
  sapr: Number, // sale_price
  crtm: {type:Date, default: Date.now}, // create timestamp
  uptm: {type:Date, default: Date.now} // update timestamp
});

export default mongoose.model('Trade', TradeSchema);
