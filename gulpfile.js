const gulp = require("gulp");
const sass = require("gulp-sass");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("gulp-csso");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const run = require("run-sequence");
const copy = require("gulp-copy");
const zip = require("gulp-zip");
const iconv = require("gulp-iconv");

gulp.task("style", function () {
  gulp.src("source/alert.scss")
    .pipe(plumber())
    .pipe(sass({
      includePaths: require("node-normalize-scss").includePaths
    }))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("install/js"))
    .pipe(csso())
    .pipe(rename("alert.min.css"))
    .pipe(gulp.dest("install/js"))
});

gulp.task("scripts", function () {
  return gulp.src("source/alert.js")
    .pipe(plumber())
    .pipe(gulp.dest("install/js"))
    .pipe(uglify())
    .pipe(rename("alert.min.js"))
    .pipe(gulp.dest("install/js"));
});

gulp.task("copyToBitrix", function () {
  return gulp.src("install/js/*")
    .pipe(gulp.dest("../../../bitrix/js/dbogdanoff_alert"))
});

gulp.task("dev", function(done) {
  run(
    "style",
    "scripts",
    "copyToBitrix",
    done
  );
});

gulp.task("watch", function() {
  run("dev");
  gulp.watch("source/*", ["dev"]);
});

/**
 * Подготовка к публикации
 * Копирование последней версии и создание архива
 */
gulp.task("copyLastVersion", function () {
  return gulp.src(["install/**/*", "lang/**/*", "include.php"], {
    base: "./.last_version"
  })
    .pipe(copy(".last_version"))
});

gulp.task("encodeFiles", function () {
  return gulp.src(".last_version/**/*")
    .pipe(iconv({encoding: 'cp1251'}))
    .pipe(gulp.dest(".last_version"))
});

gulp.task("createArchive", function () {
  return gulp.src(".last_version/**/*")
    .pipe(zip(".last_version.zip"))
    .pipe(gulp.dest("./"))
});

gulp.task("build", function(done) {
  run(
    "dev",
    "copyLastVersion",
    "encodeFiles",
    "createArchive",
    done
  );
});
