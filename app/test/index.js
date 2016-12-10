var test = require('assert');
var superagent = require('superagent');
var express = require('express');
var httpStatus = require('http-status');
var wagner = require('wagner-core');

var connection = require('../settings/connectionString');

describe('Test API',function(){
  var server;
  var Category;
  var Product;

  before(function(){
    var app = express();

    var models = require('../api/models')(wagner);

    app.use(require('../api/category')(wagner));
    app.use(require('../api/product')(wagner));

    server = app.listen(connection.SERVER_PORT);

    Category = models.Category;
    Product = models.Product;

  });

  after(function(){
    Category.remove({}, function(error) {
      test.ifError(error);
    });
    Product.remove({}, function(error) {
      test.ifError(error);
    });
    server.close();
  });

  it('Get category home',function(done){
    var url = connection.SERVER_URL_ROOT + '/category';
    superagent.get(url).end(function(error,res){
        test.ifError(error);
        test.equal(res.status,httpStatus.OK);
        test.equal(res.text,'I am here!');
        done()
    });
  });

  it('Create category',function(done){
    var category = [
      { _id:"Phones" },
      { _id:"iPhone", parent:"Phones"},
      { _id:"Android", parent:"Phones"}
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

  it('Get category by id',function(done){
    var url = connection.SERVER_URL_ROOT + '/category/id/Phones';
    superagent
    .get(url)
    .end(function(error,res){
        test.ifError(error);
        test.equal(res.status,httpStatus.OK);
        done()
    });
  });

  it('Create products',function(done){
    var products = [
      {
        name:"Samsung Galaxy S4",
        price:{
          amount:1000.00,
          currency:'USD'
        },
        category:{
          _id:'Android',
          ancestors:['Phones','Android']
        }
      },
      {
        name:"Samsung Galaxy S4 mini",
        price:{
          amount:500.00,
          currency:'USD'
        },
        category:{
          _id:'Android',
          ancestors:['Phones','Android']
        }
      }
    ];

    var url = connection.SERVER_URL_ROOT + '/product';

    superagent.put(url)
    .send(products)
    .type('json')
    .set('Accept', 'application/json')
    .end(function(error,res){
      test.ifError(error);
      test.equal(res.status,httpStatus.CREATED);
      done();
    });
  });
});
