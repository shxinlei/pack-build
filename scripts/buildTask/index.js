const publicTask = require("../task")
const gulp = require("gulp");


const build = gulp.series(
    publicTask.lessTask,
    publicTask.jsTask,
    publicTask.esTask
)





module.exports = build