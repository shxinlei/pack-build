#!/usr/bin/env node
const build = require("./scripts/buildTask");
const gulp = require("gulp");
const glob = require("glob");

const start = (done) => {
    console.log("start")
    done()
}
let src = glob.sync(`${process.cwd()}/src/**/*.{ts,tsx}`)
gulp.watch(src, {} , build)





exports.build = build;
exports.start = start
