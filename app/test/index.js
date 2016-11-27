var test = require('assert');
var superagent = require('superagent');
var express = require('express');
var httpStatus = require('http-status');
var wagner = require('wagner-core');

var connection = require('../settings/connectionString');

describe('Category API',function(){
  var server;
  var Category;

  before(function(){
    var app = express();

    var models = require('../models/category')(wagner);
    app.use(require('../api/category')(wagner));

    server = app.listen(connection.SERVER_PORT);

    Category = models.Category;
  });

  after(function(){
    server.close();
  });

  beforeEach(function(done) {
    Category.remove({}, function(error) {
      test.ifError(error);
      done();
    });
  });

  it('#request.get(\'/category\')',function(done){
    var url = connection.SERVER_URL_ROOT + '/category';
    superagent.get(url).end(function(error,res){
        test.ifError(error);
        test.equal(res.status,httpStatus.OK);
        test.equal(res.text,'I am here!');
        done()
    });
  });

  it('#request.put(\'/category\')',function(done){
    var category = [
      { _id:"Fiat" },
      { _id:"Palio", parent:"Fiat"},
      { _id:"Uno", parent:"Fiat"}
    ];

    var url = connection.SERVER_URL_ROOT + '/category';

    superagent.put(url)
    .send(category)
    .type('json')
    .set('Accept', 'application/json')
    .end(function(error,res){
      test.ifError(error);
      test.equal(res.status,httpStatus.CREATED);
      done();
    });
  });
});
