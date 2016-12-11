var express = require('express');
var httpStatus = require('http-status');
var bodyParser = require('body-parser');
var resultHandle = require('./resultHandle.js');

module.exports = function(wagner){
  var router = express.Router();

  router.use(bodyParser.json());

  //get product by id
  router.get('/product/id/:id',wagner.invoke(function(Product){
    return function(req, res){
      Product.findOne({ _id: req.params.id }, resultHandle.One.bind(null,'product',res));
    };
  }));

  //get products by category
  router.get('/product/category/:id',wagner.invoke(function(Product){
      return function(req,res){
        Product.find({ "category.ancestors" : req.params.id }, resultHandle.Many.bind(null,'products',res));
      };
  }));

  //create product
  router.put('/product',wagner.invoke(function(Product){
    return function(req,res){
      if(!req.body) return res.sendStatus(httpStatus.BAD_REQUEST);
      Product.insertMany(req.body,function(error,products){
        if(error){
          res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send("Error creando productos");
        }else{
            res
            .status(httpStatus.CREATED)
            .send("Productos creadados");
        }
      });
    };
  }));

  return router;
}
