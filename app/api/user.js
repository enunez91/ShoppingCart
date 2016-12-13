var express = require('express');
var httpStatus = require('http-status');
var bodyParser = require('body-parser');
var resultHandle = require('./resultHandle.js');

module.exports = function(wagner){
  var router = express.Router();

  router.use(bodyParser.json());

  //add cart to user
  router.put('/me/cart',wagner.invoke(function(User){
    return function(req,res){
      try{
        var cart = req.body.data.cart;
      }catch(e){
        return res
        .status(httpStatus.BAD_REQUEST)
        .json({error:'No hay productos en el carrito de compra'});
      }
      req.user.data.cart = cart;
      req.user.save(function(error,user){
        if(error){
          return res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({error:error.toString()});
        }
        return res.status(httpStatus.CREATED).json({user:user});
      });
    };
  }));

  router.get('/me',wagner.invoke(function(User){
    return function(req,res){
      if (!req.user) {
        return res.
          status(httpStatus.UNAUTHORIZED).
          json({ error: 'No ha iniciado sesion' });
      }

      req.user.populate(
        { path: 'data.cart.product'},
        resultHandle.One.bind(null, 'user', res));
    };
  }));

  return router;
};
