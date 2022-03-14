#!/usr/bin/env node

const getAutoprefixer = require("autoprefixer")



module.exports = () => {
    return getAutoprefixer({
        remove: false,
    })
}