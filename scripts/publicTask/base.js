#!/usr/bin/env node

const path = require("path");
const less = require("gulp-less")
const postcss = require('gulp-postcss');
const gulp = require("gulp")
const getAutoprefixer = require("./getAutoprefixer");
const {babelify} = require("./constants");

const cmdType = process.env?.npm_lifecycle_event;

let defaultTaskType = {
    build: path.resolve(process.cwd(), "src"),
    start: path.resolve(process.cwd(),"example")
}


const lessTask = (done) => {
    // assets 路径
    let lessPath = path.resolve(defaultTaskType[cmdType], "**/*.less");
    gulp.src(lessPath)
        .pipe(less())
        .pipe(postcss(
            [getAutoprefixer()] ,
            { modules: true }
        )).pipe(
        gulp.dest(path.resolve(process.cwd(), "./scripts"))
    )

    done();
}

const jsTask = (done) => {
    babelify()
    done();
}

const esTask = (done) => {
    babelify(false);
    done()
}

module.exports = {
    lessTask,
    jsTask,
    esTask
}