require('dotenv').config();

module.exports = function(wagner){
  var stripe = require('stripe')(process.env.STRIPE_API_KEY);
  wagner.factory('Stripe',function(){
    return stripe;
  });
  return {
    Stripe: stripe
  };
};
