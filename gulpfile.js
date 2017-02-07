var gulp = require('gulp');
var apidoc = require('gulp-apidoc');
var open = require('gulp-open');
var mocha = require('gulp-mocha');
gulp.task('default', []);

gulp.task('doc', function(done) {
    apidoc({
        src: 'routes/',
        dest: 'apidoc/',
    }, done);
    gulp.src('apidoc/index.html').pipe(open({
        app: 'google-chrome-stable'
    }));
});

gulp.task('test', done => {
    gulp.src(['test/*.js', '!test/testData.js'])
        .pipe(mocha());
});
