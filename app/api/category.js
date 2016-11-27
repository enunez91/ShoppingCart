var express = require('express');
var httpStatus = require('http-status');
var bodyParser = require('body-parser');

module.exports = function(wagner){
  var router = express.Router();

  router.use(bodyParser.json());

  router.get('/category',function(req,res){
    res
    .status(httpStatus.OK)
    .send("I am here!");
  });

  router.put('/category',wagner.invoke(function(Category){
    return function(req,res){

      if(!req.body) return res.sendStatus(httpStatus.BAD_REQUEST);

      Category.insertMany(req.body,function(error,categories){
        if(error){
          res.status(httpStatus.INTERNAL_SERVER_ERROR).send("Error creando categoria");
        }else{
            res.status(httpStatus.CREATED).send("Categoria creada");
        }
      });
    };
  }));

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
