#!/usr/bin/env node
const build = require("./scripts/buildTask");

const start = (done) => {
    console.log("start")
    done()
}

exports.build = build;
exports.start = start
