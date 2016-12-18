var mongoose = require('mongoose');
var cat = require('./category.js');

var productSchema = {
  name:{ type:String, required:true },
  pictures:[{ type:String, match:/^http:\/\//i }],
  price:{
    amount:{ type:Number, required:true },
    currency:{
      type:String,
      enum:['USD','VEF'],
      required:true
    }
  },
  category:cat.categorySchema
};

var schema = new mongoose.Schema(productSchema);

var currencySymbol = {
  'USD':'$',
  'VEF':'Bs'
};


schema.virtual('displayPrice').get(function(){
  return currencySymbol[this.price.currency] +
         this.price.amount;
});

schema.index({ name:'text'});

module.exports = schema;
module.exports.productSchema = productSchema;
