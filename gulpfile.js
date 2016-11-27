var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('MyTest',function(){
  gulp
    .src('app/test/index.js')
    .pipe(mocha())
    .on('error',function(error){
      this.emit('end');
    });
});

gulp.task('watch',function(){
  gulp.watch('./app/*/*.js',['MyTest']);
});
