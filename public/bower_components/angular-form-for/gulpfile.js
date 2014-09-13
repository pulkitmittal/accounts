var gulp = require('gulp');
var es = require('event-stream');
var pipe = es.pipe.bind(es);
var concat = require('gulp-concat');
var shell = require('gulp-shell');

var CONFIG = {
  distDir: 'dist',
  sourceDir: 'source',
  stylesDir: 'styles',
  testDir: 'tests'
};

var jsSources = es.merge(
  gulp.src(CONFIG.sourceDir + '/**/module.js'), // Defines the formFor module; must be loaded first
  gulp.src([CONFIG.sourceDir + '/**/*.js', '!' + CONFIG.sourceDir + '/**/module.js']));

gulp.task('clean', function() {
  var rm = require('gulp-rimraf');

  pipe(
    gulp.src(['dist'], {read: false}),
    rm());
});

gulp.task('compileCss', function() {
  var stylus = require('gulp-stylus');
  var autoprefixer = require('autoprefixer-stylus');
  var nib = require('nib');

  return gulp.src(CONFIG.stylesDir + '/**/*.styl')
    .pipe(stylus({use: [nib(), autoprefixer()]}))
    .pipe(concat('form-for.css'))
    .pipe(gulp.dest(CONFIG.distDir));
});

var concatJS = function() {
  var order = require('gulp-order');
  var templateCache = require('gulp-angular-templatecache');
  var ngAnnotate = require('gulp-ng-annotate');

  var sources =
    es.merge(
      gulp.src('templates/**/*.html')
        .pipe(templateCache('templates.js', {
          module: 'formFor.templates',
          standalone: true,
          root: 'form-for/templates/'
        })),
      jsSources.pipe(concat('form-for.js')));

  return sources
    .pipe(order([
      'templates.js',
      'form-for.js'
    ]))
    .pipe(ngAnnotate());
};

gulp.task('createUncompressedJs', function() {
  return concatJS()
    .pipe(concat('form-for.js'))
    .pipe(gulp.dest(CONFIG.distDir));
});

gulp.task('createCompressedJs', function() {
  var uglify = require('gulp-uglify');

  return concatJS()
    .pipe(uglify())
    .pipe(concat('form-for.min.js'))
    .pipe(gulp.dest(CONFIG.distDir));
});

gulp.task('lintJs', function() {
  var jshint = require('gulp-jshint');

  return jsSources
    .pipe(jshint());
});

gulp.task('test', function(done) {
  var karma = require('gulp-karma');

  return gulp.src('noop') // See http://stackoverflow.com/questions/22413767/angular-testing-with-karma-module-is-not-defined
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
});

gulp.task('docs', shell.task([
  'node_modules/jsdoc/jsdoc.js ' +
    '-c node_modules/angular-jsdoc/conf.json ' +  // config file
    '-t docs/template ' +                         // template file
    '-d ' + CONFIG.distDir + '/docs '+            // output directory
    '-r ' + CONFIG.sourceDir                      // source code directory
]));

gulp.task('build', ['clean', 'lintJs', 'test', 'createCompressedJs', 'createUncompressedJs', 'compileCss', 'docs']);
