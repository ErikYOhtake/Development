'use strict';

import mongoose from 'mongoose';

var ProductSchema = new mongoose.Schema({
  rurl: String, // rawdata_url
  murl: String, // maskeddata_url
  pbad: String, // product_blockchain_address
  prnm: String, // product_name
  expr: {type:Boolean, default: false}, // exclusive_propriety
  seid: mongoose.Schema.Types.ObjectId, // seller_id
  sbad: String, // seller_blockchain_address
  ctgy: Array, // category
  dipr: {type:Boolean, default: false}, // discontinued_propriety
  sapr: {type:Number, default: 50}, // sale_price
  sanu: {type:Number, default: 0}, // sale_number
  shpo: {type:Number, default: 0}, // share_point
  penu: {type:Number, default: 0}, // positive_evaluation_number
  nenu: {type:Number, default: 0}, // negative_evaluation_number
  nest: {type:Number, default: 1}, // negative_evaluation_status
  neci: {type:Array, dafault: []}, // negative_evaluation_curator_id
  crtm: {type:Date, default: Date.now}, // create timestamp
  uptm: Date // update timestamp
});

export default mongoose.model('Product', ProductSchema);
