var express = require('express');
var httpStatus = require('http-status');

module.exports = function(wagner){
  var router = express.Router();

  router.use(function(req, res, next){
    console.log("Time:" , Date.Now);
  });

  router.get('/category',function(req,res){
    res.sendStatus(200);
    res.send("I am here!");
  });

  router.get('/category/id/:id',wagner.invoke(function(Category){
    return function(req, res){
      Category.findOne({ _id: req.params.id },function(error,category){
        if(error){
          return res
                  .status(httpStatus.INTERNAL_SERVER_ERROR)
                  .json({ error: error.toString() });
        }
        if(!category){
          return res
                  .status(httpStatus.NOT_FOUND)
                  .json({ error: httpStatus[404] });
        }
        res.status(httpStatus.OK).json({ category:category });
      });
    };
  }));

  return router;
}
