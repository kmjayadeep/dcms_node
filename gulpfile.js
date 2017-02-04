var gulp = require('gulp');
var apidoc = require('gulp-apidoc');
var open = require('gulp-open');
gulp.task('default', []);

gulp.task('doc', function(done) {
    apidoc({
        src: 'routes/',
        dest: 'apidoc/',
    }, done);
    // gulp.src('apidoc/index.html').pipe(open({
        // app: 'google-chrome'
    // }));	
});
