var httpStatus = require('http-status');

module.exports.One = function(property, res, error, result){
  if(error){
    return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.toString() });
  }
  if(!result){
    return res
            .status(httpStatus.NOT_FOUND)
            .json({ error: httpStatus[404] });
  }
  var json = {};
  json[property] = result;
  res.status(httpStatus.OK).json(json);
};

module.exports.Many = function(property, res, error, result){
  if(error){
    return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.toString() });
  }
  var json = {};
  json[property] = result;
  res.status(httpStatus.OK).json(json);
};
