var express = require('express');
var wagner = require('wagner-core');

require('./api/models')(wagner);

var app = express();

wagner.invoke(require('./api/auth'), { app: app });

app.use('/api/v1',
  require('./api/category')(wagner),
  require('./api/product')(wagner),
  require('./api/user')(wagner));

app.listen(3000);
console.log('Listening on port 3000!');
