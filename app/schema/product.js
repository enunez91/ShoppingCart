var mongoose = require('mongoose');
var cat = require('./category.js');

var productSchema = {
  name:{ type:String, required:true },
  pictures:[{ type:String, match:/^http:\/\//i }],
  price:{
    amount:{ type:Number, required:true },
    currency:{
      type:String,
      enum:['USD','EUR','GBP'],
      required:true
    }
  },
  category:cat.categorySchema
};

module.exports = new mongoose.Schema(productSchema);
module.exports.productSchema = productSchema;
