var express = require('express');
var httpStatus = require('http-status');
var bodyParser = require('body-parser');
var _ = require('underscore');
var resultHandle = require('./resultHandle.js');

module.exports = function(wagner){
  var router = express.Router();

  router.use(bodyParser.json());

  router.post('/checkout',wagner.invoke(function(User,Stripe){
    return function(req,res){
      if (!req.user) {
        return res.
          status(httpStatus.UNAUTHORIZED).
          json({ error: 'Not logged in' });
      };
      req.user
      .populate({path:'data.cart.product', model:'Product'}
      ,function(error,user){
        if(error){
          return res.
            status(httpStatus.INTERNAL_SERVER_ERROR).
            json({ error: error.toString() });
        }
        if(!user){
          return res.
            status(httpStatus.NOT_FOUND).
            json({ error: 'User not found' });
        }
        var totalAmount = 0;

        _.each(user.data.cart,function(item) {
           totalAmount += item.product.price.amount * item.quantity;
        });
        var token = req.body.stripeToken;
        Stripe.charges.create(
          {
            amount:Math.ceil(totalAmount * 100),
            currency:'usd',
            source:token,
            description:'Example charge'
          },
          function(error,charge){
            if (error && error.type === 'StripeCardError') {
              return res.
                  status(httpStatus.BAD_REQUEST).
                  json({ error: error.toString() });
            }
            if (error) {
              return res.
                status(httpStatus.INTERNAL_SERVER_ERROR).
                json({ error: error.toString() });
            }
            req.user.data.cart = [];
            req.user.save(function() {
              return res.status(httpStatus.OK).json({ id: charge.id });
            });
          }
        );
      });
    };
  }));
  return router;
};
