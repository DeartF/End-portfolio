var gulp        = require('gulp'),
	sass        = require('gulp-sass'),
	browserSync = require('browser-sync'),
	concat      = require('gulp-concat'),
	uglify      = require('gulp-uglifyjs'),
	cssnano     = require('gulp-cssnano'),
	rename      = require('gulp-rename'),
	clean       = require('gulp-clean'),
	imagemin    = require('gulp-imagemin'),
	pngquant    = require('imagemin-pngquant'),
	cache       = require('gulp-cache'),
	autoprefixer= require('gulp-autoprefixer');

gulp.task('sass' , function() {
	return gulp.src('app/sass/**/*.sass') // ! - исключает из выборки /**/ - все поддериктории /*.sass - файлы которые могут иметь любое название но оканчиваются на .sass  *.+(scss|sass) - выбирает все файлы scss & sass
	.pipe(sass()) // файлы которые начинаются с нижнего подчеркивания (_) - они не учавствуют в компиляции как отдельные файлы и добавляются в sass только через импорт
	.pipe(autoprefixer(['last 15 versions', 'ie 8' , 'ie 7'] , {cascade: true}))
	.pipe(gulp.dest('app/css/'))
	.pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts' , function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js' ,
		'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js' ,
	
	])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js/'))
});

gulp.task('css-libs' , ['sass'] , function() {
	return gulp.src('app/css/libs.css')
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('app/css/'))
});
 

gulp.task('browser-sync' , function() {
	browserSync({
		server: {
			baseDir : 'app'
		},
		notify : false
	});
});

gulp.task('clean' , function() {
	return gulp.src('dist' , {read : false})
	.pipe(clean())
});

gulp.task('clear' , function() {
	return cache.clearAll()
});

gulp.task('img' , function() {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin({
		interlaced : true,
		progressive: true,
		svgoPlugins:[{removeViewBox: false, }],
		use: [pngquant()]
	})))
	.pipe(gulp.dest('dist/img'))
});


gulp.task('watch' , ['browser-sync' , 'css-libs' , 'scripts'] , function() {
	gulp.watch('app/sass/**/*.sass' , ['sass']);
	gulp.watch('app/*.html' , browserSync.reload);
	gulp.watch('app/js/**/*.js' , browserSync.reload);
});

gulp.task('build', ['clean' , 'img' , 'sass' , 'scripts'] , function() {
	 var buildCss = gulp.src([
	 	'app/css/main.css' ,
	 	'app/css/libs.min.css'
	 ])
	 .pipe(gulp.dest('dist/css'))

	 var buildFonnts = gulp.src('app/fonts/**/*')
	 .pipe(gulp.dest('dist/fonts'))

	 var buildJs = gulp.src('app/js/**/*')
	 .pipe(gulp.dest('dist/js'))

	 var buildHTML = gulp.src('app/*.html')
	 .pipe(gulp.dest('dist/'))
});


/*gulp.task('mytask' , function() {
	return gulp.src('source-files');
	.pipe(plugin())
	.pipe(gulp.dest('folder'))
});*/

