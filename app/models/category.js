var mongoose = require('mongoose');
var connection = require('../settings/connectionString')
module.exports = function(wagner){
  mongoose.connect(connection.DATABASE_URL_ROOT);
  var model = mongoose.model('Category',require('../schema/category'));
  wagner.factory('Category',function(){
    return model;
  });
  return { Category : model };
}
