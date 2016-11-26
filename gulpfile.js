var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');

gulp.task('styles', function() {
    gulp.src('sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css/'))
});

gulp.task('javascript', function() {
	/* combine lib js */
	//gulp.src('./lib/**/*.js')
    	//.pipe(concat('lib.js'))
    	//.pipe(gulp.dest('./'));
    /* combine app js */
	gulp.src('./js/*.js')
    	.pipe(concat('app.js'))
    	.pipe(gulp.dest('./'));
});

//Watch task
gulp.task('default',function() {
    gulp.watch('sass/**/*.scss',['styles'])
    //gulp.watch('./lib/**/*.js', ['javascript'])
    gulp.watch('./js/*.js', ['javascript'])
});
