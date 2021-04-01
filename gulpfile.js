//initialize all of our variables
var app, base, concat, directory, gulp, gutil, hostname, path, refresh, sass, uglify, imagemin, minifyCSS, del, browserSync, autoprefixer, gulpSequence, shell, sourceMaps, plumber;

var autoPrefixBrowserList = ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];

//load all of our dependencies
//add more here if you want to include more libraries
gulp = require('gulp');
gutil = require('gulp-util');
concat = require('gulp-concat');
uglify = require('gulp-uglify');
sass = require('gulp-sass');
sourceMaps = require('gulp-sourcemaps');
imagemin = require('gulp-imagemin');
minifyCSS = require('gulp-minify-css');
browserSync = require('browser-sync');
autoprefixer = require('gulp-autoprefixer');
gulpSequence = require('gulp-sequence').use(gulp);
shell = require('gulp-shell');
plumber = require('gulp-plumber');

const { watch, series } = require('gulp');

gulp.task('browserSync', function () {
    browserSync({
        server: {
            baseDir: "app/"
        },
        options: {
            reloadDelay: 05
        },
        notify: true
    });
});


//compressing images & handle SVG files
gulp.task('images', gulp.series( function (tmp) {
    gulp.src(['app/images/*.jpg', 'app/images/*.png'])
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
        .pipe(gulp.dest('app/images'));
}));

//compressing images & handle SVG files
gulp.task('imagesDeploy', gulp.series( function () {
    gulp.src(['app/images/**/*', '!app/images/README'])
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(gulp.dest('dist/images'));
}));

//compiling our Javascripts
gulp.task('scripts', gulp.series( function () {
    //this is where our dev JS scripts are
    return gulp.src(['app/js/src/_includes/**/*.js', 'app/js/src/**/*.js'])
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        //this is the filename of the compressed version of our JS
        .pipe(concat('app.js'))
        //catch errors
        .on('error', gutil.log)
        //where we will store our finalized, compressed script
        .pipe(gulp.dest('app/js'))
        //notify browserSync to refresh
        .pipe(browserSync.reload({ stream: true }));
}));

//compiling our Javascripts for deployment
gulp.task('scriptsDeploy', gulp.series( function () {
    //this is where our dev JS scripts are
    return gulp.src(['app/js/src/_includes/**/*.js', 'app/js/src/**/*.js'])
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        //this is the filename of the compressed version of our JS
        .pipe(concat('app.js'))
        //compress :D
        .pipe(uglify())
        //where we will store our finalized, compressed script
        .pipe(gulp.dest('dist/js'));
}));

//compiling our SCSS files
gulp.task('styles', gulp.series( function () {
    //the initializer / master SCSS file, which will just be a file that imports everything
    return gulp.src('app/css/scss/init.scss')
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        //get sourceMaps ready
        .pipe(sourceMaps.init())
        //include SCSS and list every "include" folder
        .pipe(sass({
            errLogToConsole: true,
            includePaths: [
                'app/css/scss/'
            ]
        }))
        .pipe(autoprefixer({
            browsers: autoPrefixBrowserList,
            cascade: true
        }))
        //catch errors
        .on('error', gutil.log)
        //the final filename of our combined css file
        .pipe(concat('styles.css'))
        //get our sources via sourceMaps
        .pipe(sourceMaps.write())
        //where to save our final, compressed css file
        .pipe(gulp.dest('app/css'))
        //notify browserSync to refresh
        .pipe(browserSync.reload({ stream: true }));
}));

//compiling our SCSS files for deployment
gulp.task('stylesDeploy', gulp.series( function () {
    //the initializer / master SCSS file, which will just be a file that imports everything
    return gulp.src('app/css/scss/init.scss')
        .pipe(plumber())
        //include SCSS includes folder
        .pipe(sass({
            includePaths: [
                'app/css/scss',
            ]
        }))
        .pipe(autoprefixer({
            browsers: autoPrefixBrowserList,
            cascade: true
        }))
        //the final filename of our combined css file
        .pipe(concat('styles.css'))
        .pipe(minifyCSS())
        //where to save our final, compressed css file
        .pipe(gulp.dest('dist/css'));
}));

//basically just keeping an eye on all HTML files
gulp.task('html', gulp.series( function () {
    //watch any and all HTML files and refresh when something changes
    return gulp.src('app/*.html')
        .pipe(plumber())
        .pipe(browserSync.reload({ stream: true }))
        //catch errors
        .on('error', gutil.log);
}));

//migrating over all HTML files for deployment
gulp.task('htmlDeploy', gulp.series( function () {
    //grab everything, which should include htaccess, robots, etc
    gulp.src('app/*')
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(gulp.dest('dist'));

    //grab any hidden files too
    gulp.src('app/.*')
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(gulp.dest('dist'));

    gulp.src('app/fonts/**/*')
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(gulp.dest('dist/fonts'));

    //grab all of the styles
    gulp.src(['app/css/*.css', '!app/css/styles.css'])
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(gulp.dest('dist/css'));
}));

//cleans our dist directory in case things got deleted
gulp.task('clean', gulp.series( function () {
    return shell.task([
        'rm -rf dist'
    ]);
}));

//create folders using shell
gulp.task('scaffold', gulp.series( function () {
    return shell.task([
        'mkdir dist',
        'mkdir dist/fonts',
        'mkdir dist/images',
        'mkdir dist/js',
        'mkdir dist/css'
    ]
    );
}));

//this is our master task when you run `gulp` in CLI / Terminal
//this is the main watcher to use when in active development
//  this will:
//  startup the web server,
//  start up browserSync
//  compress all scripts and SCSS files
gulp.task('default', gulp.parallel( ['browserSync', 'scripts', 'styles'], function () {
    //a list of watchers, so it will watch all of the following files waiting for changes
    gulp.watch('app/js/src/**', gulp.series(['scripts']));
    gulp.watch('app/css/scss/**', gulp.series(['styles']));
    gulp.watch('app/images/**', gulp.series(['images']));
    gulp.watch('app/*.html', gulp.series(['html']));
}));

//this is our deployment task, it will set everything for deployment-ready files
// gulp.task('deploy', gulpSequence('clean', 'scaffold', ['scriptsDeploy', 'stylesDeploy', 'imagesDeploy'], 'htmlDeploy'));

// gulp.task('deploy', gulp.series(['clean', 'scaffold', 'scriptsDeploy', 'stylesDeploy', 'imagesDeploy', 'htmlDeploy'] ));

gulp.task('deploy', gulp.parallel('clean', 'scaffold',['scriptsDeploy', 'stylesDeploy', 'imagesDeploy', 'htmlDeploy']));
