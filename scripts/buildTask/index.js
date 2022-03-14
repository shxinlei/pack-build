const publicTask = require("../publicTask")
const gulp = require("gulp");


const build = gulp.series(
    publicTask.lessTask,
    publicTask.jsTask,
    publicTask.esTask
)


module.exports = build