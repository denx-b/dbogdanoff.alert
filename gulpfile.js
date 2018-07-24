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
const del = require("del");
const zip = require("gulp-zip");
const iconv = require("gulp-iconv");

const git = require("gulp-git");
const file = require("gulp-file");
const moment = require("moment");
const os = require("os");

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

gulp.task("clean", function() {
  return del([".last_version", ".last_version.zip", "install/js", "../../../bitrix/js/dbogdanoff_alert", "gulpfile.min.js"], {
    force: true
  });
});

gulp.task("dev", function(done) {
  run(
    "clean",
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
gulp.task("getLastVersion", function () {
  git.exec({args: 'log --tags --simplify-by-decoration --pretty="format:%cI %d"'}, function(error, output) {
    var versions = output.trim().split(os.EOL);
    if (typeof versions === "object")
      versions = versions[0];

    var last = "";
    if (versions.length < 1) {
      last = moment().format() + "  (tag: 0.0.1)";
    }
    else {
      last = versions;
    }

    const pattern = /(.*)\s\s\((.*)tag:\s(.*)\)/gi;
    const match = pattern.exec(last);

    const lastVersionDate = moment(match[1]).format("YYYY-MM-DD HH:mm:ss");
    const lastVersion = match[3];

    const fileContents = "<?\n" +
      "$arModuleVersion = array(\n" +
      "    'VERSION' => '" + lastVersion + "',\n" +
      "    'VERSION_DATE' => '" + lastVersionDate + "',\n" +
      ");\n";

    return file("version.php", fileContents)
      .pipe(gulp.dest("install"));
  });
});

gulp.task("copyLastVersion", function () {
  return gulp.src(["install/**/*", "lang/**/*", "include.php"], {
    base: "./.last_version"
  })
    .pipe(copy(".last_version"))
});

gulp.task("encodeFiles", function () {
  return gulp.src(".last_version/**/*")
    .pipe(iconv({encoding: "cp1251"}))
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
    "getLastVersion",
    "copyLastVersion",
    "encodeFiles",
    "createArchive",
    done
  );
});
