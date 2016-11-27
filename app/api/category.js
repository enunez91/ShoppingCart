var express = require('express');
var httpStatus = require('http-status');
var bodyParser = require('body-parser');

module.exports = function(wagner){
  var router = express.Router();
  var jsonParser = bodyParser.json();
  var urlencodeParser = bodyParser.urlencoded({ extended : true });

  router.use(function(req, res, next){
    console.log("Time:" , Date.Now);
  });

  router.get('/category',function(req,res){
    res.sendStatus(httpStatus.OK);
    res.send("I am here!");
  });

  router.post('/category',urlencodeParser,wagner.invoke(function(Category){
    return function(req,res){
      if(!req.body) return res.sendStatus(httpStatus.BAD_REQUEST);

      var category = new Category({
        _id: req.body._id,
        parent: req.body.parent,
        ancestors: req.body.ancestors
      });

      category.save(function(error){
        if(error){
          res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
          res.send("Error creando categoria");
        }else{
          res.sendStatus(httpStatus.CREATED);
          res.send("Categoria creada");
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
