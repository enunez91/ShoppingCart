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
  var User;

  before(function(){
    var app = express();

    var models = require('../api/models')(wagner);

    Category = models.Category;
    Product = models.Product;
    User = models.User;

    app.use(require('../api/category')(wagner));
    app.use(require('../api/product')(wagner));
    app.use(require('../api/user')(wagner));
    app.use(function(req,res,next){
      User.findOne({},function(error,user){
        test.ifError(error);
        req.user = user;
      });
      next();
    });

    server = app.listen(connection.SERVER_PORT);
  });

  before(function(done){
    var users = [{
      profile: {
        username: 'enunez'
      },
      data: {
        oauth: 'invalid',
        cart: []
      }
    }];
    User.insertMany(users,function(error,docs){
      test.ifError(error);
      done();
    });
  });

  after(function(){
    Category.remove({}, function(error) {
      test.ifError(error);
    });
    Product.remove({}, function(error) {
      test.ifError(error);
    });
    User.remove({}, function(error){
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

  it('Get product by id',function(done){
    var url = connection.SERVER_URL_ROOT + '/product/id/';
    Product.findOne({},function(error,doc){
      test.ifError(error);
      superagent.get(url + doc.id)
      .end(function(error,res){
          test.ifError(error);
          test.equal(res.status,httpStatus.OK);
          done()
      });
    });
  });

  it('Get products by category id',function(done){
    var url = connection.SERVER_URL_ROOT + '/product/category/';
    Category.findOne({ _id:'Android'},function(error,doc){
      test.ifError(error);
      superagent.get(url + doc.id)
      .end(function(error,res){
        test.ifError(error);
        var result;
        test.doesNotThrow(function() {
          result = JSON.parse(res.text).products;
        });
        test.equal(2,result.length);
        done();
      });
    });
  });
});
