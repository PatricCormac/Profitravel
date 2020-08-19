const { src, dest, series, watch } = require("gulp");
const sync = require("browser-sync").create();
const del = require("del");
const csso = require("gulp-csso");
const include = require("gulp-file-include");
const htmlmin = require("gulp-htmlmin");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");
const imagemin = require("gulp-imagemin");
const pngquant = require("imagemin-pngquant");
const cache = require("gulp-cache");

function html() {
  return src("src/**.html")
    .pipe(
      include({
        prefix: "@@",
      })
    )
    .pipe(
      htmlmin({
        collapseWhitespace: true,
      })
    )
    .pipe(dest("dist"));
}

function scss() {
  return src("src/styles/**.scss")
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(csso())
    .pipe(concat("main.css"))
    .pipe(dest("dist"));
}

function img() {
  return src("src/img/**/*")
    .pipe(
      cache(
        imagemin({
          interlaced: true,
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }],
          use: [pngquant()],
        })
      )
    )
    .pipe(dest("dist/img"));
}

function clear() {
  return del("dist");
}

function serve() {
  sync.init({
    server: "./dist",
  });

  watch("src/**.html", series(html)).on("change", sync.reload);
  watch("src/styles/**/*.scss", series(scss)).on("change", sync.reload);
}

exports.build = series(clear, img, scss, html);
exports.serve = series(clear, img, scss, html, serve);
exports.clear = clear;
