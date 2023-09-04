const { src, dest, series, parallel, watch } = require('gulp')
const concat = require('gulp-concat')
const clean = require('gulp-clean')
const uglify = require('gulp-uglify')
const sourcemaps = require('gulp-sourcemaps')
const browserSync = require('browser-sync').create()
 
function startTask (done) {
    browserSync.init({
      server: {
        baseDir: './dist'
      }
    })

    watch('./src/*.html', series(copyHtmlTask, reloadBrowser))
    watch([
        '../../lib/showError.js',
        '../../lib/form/getFormData.js',
        '../../lib/form/clearFormData.js',
        './src/index.js',
      ], series(copyJsTask, reloadBrowser))
      watch('./src/*.css', series(copyCssTask, reloadBrowser))

    done()
}

function reloadBrowser (done) {
    browserSync.reload()
    done()
}
  

function buildTask() {
    return series(clearDistTask, 
        parallel(
            copyHtmlTask, 
            copyJsTask, 
            copyCssTask
    ))  
}

function clearDistTask () {
    return src('./dist', {read: false, allowEmpty: true}).pipe(clean());
  }

function copyHtmlTask () {
    return src('./src/index.html').pipe(dest('./dist'))
}

function copyJsTask () {
    return src([
    '../lib/showError.js',
    '../lib/form/getFormData.js',
    '../lib/form/clearFormData.js',
    './src/script.js'
])
    .pipe(concat('app.js'))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(dest('./dist'))
}

function copyCssTask () {
    return src('./src/*.css')
      .pipe(concat('app.css'))
      .pipe(dest('./dist'))
  }


  exports.build = buildTask()
  exports.start = series(buildTask(), startTask)