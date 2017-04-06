//引入依赖
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var combiner = require('stream-combiner2');
var path = require('path');
var livereload = require('gulp-livereload');
//引入任务列表
var concat = require('gulp-concat');
// var uglify = require('gulp-uglify');
var less = require('gulp-less');
var jade = require('gulp-jade');
// var del = require('del');

//引入插件
var LessPluginCleanCSS = require('less-plugin-clean-css'),
  LessPluginAutoPrefix = require('less-plugin-autoprefix'),
  cleancss = new LessPluginCleanCSS({
    advanced: true
  }),
  autoprefix = new LessPluginAutoPrefix({
    browsers: ["last 2 versions"]
  });
//var imagemin = require('gulp-imagemin');


//设置路径
var paths = {
  //less: ['src/less/**/*.less'],
  jade: ['template/**/*.jade'],
  adminLess : ['admin/less/**/*.less']
};

//配置清理任务
// gulp.task('clean', function(cb) {
//   del(['build'], cb);
// });
//
// gulp.task('cleancss', function(cb) {
//   del(['src/css'], cb);
// });

//配置less任务
// gulp.task('less', function() {
//   var combined = combiner.obj([
//     gulp.src(paths.less),
//     less({
//       plugins: [autoprefix, cleancss]
//     }),
//     sourcemaps.write('.'),
//     // concat('result.css'),
//     gulp.dest('./src/css'),
//     livereload()
//   ]);
//   combined.on('error', console.error.bind(console));
//   return combined;
// });
// gulp.task('livereload', function(){
//   livereload();
// });
//配置JS任务
// gulp.task('scripts', function() {
//   return gulp.src(paths.scripts)
//     .pipe(sourcemaps.init())
//     .pipe(uglify())
//     //.pipe(concat('all.min.js'))
//     .pipe(sourcemaps.write('.'))
//     .pipe(gulp.dest('build/js'));
// });

//配置压缩图片任务
//gulp.task('images', ['clean'], function() {
//    return gulp.src(paths.images)
//        .pipe(imagemin({optimizationLevel: 5}))
//        .pipe(gulp.dest('build/img'));
//});
gulp.task('adminLess', function(){
  var combined = combiner.obj([
    gulp.src(paths.adminLess),
    less({
      plugins: [autoprefix, cleancss]
    }),
    sourcemaps.write('.'),
    gulp.dest('./admin/css'),
    livereload()
  ]);
  combined.on('error', console.error.bind(console));
  return combined;
});
gulp.task('jade', function(){
   var YOUR_LOCALS = {};
  var combined = combiner.obj([
    gulp.src(paths.jade),
    jade({
      locals : YOUR_LOCALS
    }),
    gulp.dest('./'),
    livereload()
  ])
  combined.on('error', console.error.bind(console));
  return combined;
})

gulp.task('release', function(){
  var locals ={
    release: true
  }
  gulp.src(paths.jade).pipe(jade({
    locals: locals
  })).pipe(gulp.dest('./'))
})


//配置watch任务
gulp.task('watch', function() {
  livereload.listen();
  // gulp.watch(paths.less, ['less']);
  // gulp.watch(paths.adminLess, ['adminLess']);
  gulp.watch(paths.jade, ['jade']);
});


//配置默认任务
gulp.task('default', ['jade','watch']);
