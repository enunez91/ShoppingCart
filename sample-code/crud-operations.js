var mongodb = require('mongodb');
var test = require('assert');

var uri = 'mongodb://localhost:27017/example';
mongodb.MongoClient.connect(uri,function(error,db){
  test.equal(null,error);

  //docs
  var movie = [
    {
      title:'Jaws',
      year:1975,
      director:'Steven Spielberg',
      rating:'PG'
    },
    {
      title:'Ex_Machine',
      year:2015,
      director:'Alex Garland',
      rating:'Sci-Fi'
    }
  ];

  //create
  db.collection('movies').insertMany(movie,function(error,r){
    test.equal(null,error);
  });

  //get all
  db.collection('movies').find().toArray(function(error,docs){
    test.equal(null,error);
    docs.forEach(function(doc) {
      console.log(JSON.stringify(doc));
    });
  });

  //get movies by year
  db.collection('movies').find({year:2015},function(error,docs){
    test.equal(null,error);
    docs.forEach(function(doc) {
      console.log(JSON.stringify(doc));
    });
  });

  db.close();
});
