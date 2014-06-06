var gulp = require('gulp');
var clean = require('gulp-clean');
var closureCompiler = require('gulp-closure-compiler');

gulp.task('clean', function () {  
  return gulp.src('dist', {read: false})
    .pipe(clean());
});

gulp.task('default', function() {
  gulp.src('mixpanel.js')
    .pipe(closureCompiler({
      compilerPath: './vendor/closure/compiler.jar',
      fileName: 'build.js'
    }))
    .pipe(gulp.dest('dist'));
});