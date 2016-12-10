var mongoose = require('mongoose');
var _ = require('underscore');
var connection = require('../settings/connectionString');

module.exports = function(wagner){

  mongoose.connect(connection.DATABASE_URL_ROOT);

  var Category = mongoose.model('Category',require('../schema/category'),'categories');
  var Product = mongoose.model('Product',require('../schema/product'),'products');

  var models = {
    Category:Category,
    Product:Product
  };

  _.each(models,function(value,key){
    wagner.factory(key,function(){
      return value;
    });
  });

  return models;
}
