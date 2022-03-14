#!/usr/bin/env node

const path = require("path")


// 执行位置的 路径拼接
const resolveCwd = (...args) => {
    args.unshift(process.cwd());
    return path.join(...args);
};

module.exports = resolveCwd;