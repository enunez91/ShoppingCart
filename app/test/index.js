var test = require('assert');
var superagent = require('superagent');
var express = require('express');
var httpStatus = require('http-status');
var wagner = require('wagner-core');

var connection = require('../settings/connectionString');

describe('Category API',function(){
  var server;

  before(function(){
    var app = express();

    require('../models/category')(wagner);
    app.use(require('../api/category')(wagner));

    server = app.listen(connection.SERVER_PORT);
  });

  after(function(){
    server.close();
  });

  describe('Server', function(){
    it('#request.get(\'/category\')',function(){
      superagent.get('/category').end(function(error,res){
          test.ifError(error);
          test.equal(res.status,httpStatus.OK);
          test.equal(res.text,'I am here!');
          done();
      });
    });

    it('#request.post(\'/category\')',function(){
      var category = [
        { _id:"Fiat" },
        { _id:"Palio", parent:"Fiat"},
        { _id:"Uno", parent:"Fiat"}
      ];

      superagent.post('/category')
      .send(category)
      .set('Content-Type', 'application/json')
      .end(function(error,res){
        test.ifError(error);
        test.equal(res.status,httpStatus.CREATED);
        done();
      });
    });
  });

});
