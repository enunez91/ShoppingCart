var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('MyTest',function(){
  gulp
    .src('sample-code/test-with-mocha.js')
    .pipe(mocha())
    .on('error',function(error){
      this.emit('end');
    });
});

gulp.task('watch',function(){
  gulp.watch('./sample-code/*.js',['MyTest']);
});
