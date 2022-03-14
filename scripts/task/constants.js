#!/usr/bin/env node

const gulp = require("gulp")
const gulpBabel = require('gulp-babel');
const path = require("path");
const cwd = process.cwd();
const src = path.resolve(cwd , "src")
const glob = require('glob');
const ts = require('gulp-typescript');
const fs = require("fs");
const tsDefaultReporter = ts.reporter.defaultReporter();
const argv = require('minimist')(process.argv.slice(2));
const babelCommonConfig = require("./babelCommonConfig")
const replaceLib = require("./replaceLib");
const through2 = require('through2');
const resolveCwd = require("./resolveCwd");
const pkg = require(resolveCwd('package.json')); // 寻找执行位置数组拼接
const lessPath = new RegExp(`(["'])([^'"]+)\/assets\/([^.'"]+).less`, 'g');
const merge2 = require("merge2")
// 编译 ts tsx 类型文件 根据不同的类型编辑不同的模块

// models 默认为 undefined
const babelify = (modules) => {

    const stream = [];

    const assets = gulp.src(
        [`${src}/**/*.@(png|svg|less|d.ts)`]
    ).pipe(
        gulp.dest(modules === false ? "es" : "lib")
    );

    // 获取文件总数
    const tsFileLength = glob.sync(`${src}/**/*.{ts,tsx}`);
    const jsFileLength = glob.sync(`${src}/**/*.{js,jsx}`);


    if(tsFileLength){
        let tsConfig = getCompilerOptions();
        let reporter = tsDefaultReporter;
        const tsResult = gulp.src(
            [
                `${src}/**/*.ts`,
                `${src}/**/*.tsx`,
                'typings/**/*.d.ts'
            ]
        ).pipe(
            ts(tsConfig,reporter)
        )

        // tsResult.on("finish" ,() => check(error))
        // tsResult.on("end" ,() => check(error))

        stream.push(
            tsResult.dts
                .pipe(gulp.dest(modules === false ? "es" : "lib"))
        )

        let streamFile = babelifyInternal(tsResult.js , modules)
        stream.push(streamFile)
    }

    if(jsFileLength){
        let streamFile = babelifyInternal(gulp.src([`${src}/**/*.js`, `${src}/**/*.jsx`]), modules)
        stream.push(streamFile)
    }

    return merge2(stream.concat(assets))
}

const check = (error) => {
    if (error) {
        console.error('编译 失败', error);
        process.exit(1);
    }
};


const babelifyInternal = (js , modules) => {
    // 解析 js 和ts babel 整合
    const babelConfig = babelCommonConfig(modules);

    if(modules === false) { // undefined 不走
        babelConfig.plugins.push(replaceLib)
    }

    let stream = js.pipe(
        gulpBabel(babelConfig) // 将整理的babel整合到gulp-babel
    )

    const replacer = (match, m1, m2 , name) => {
        return `${m1}${m2}/assets/${name}.css`;
    }
    // through2 生成对象流文件


    return stream.pipe(
        through2.obj(function (file , encoding , next) {

            const content = file.contents.toString(encoding)
                .replace(lessPath, replacer);
            file.contents = Buffer.from(content);
            this.push(file);



            next();
        }) //
    ).pipe(
        gulp.dest(modules !== false ? "lib" : "es")
    )

}

const getCompilerOptions = () => {
    const tsConfig = require(
        path.resolve(__dirname, "../config/tsconfig.json")
    );

    let customizeConfig = {};
    let isUserTsConfig = fs.existsSync(getUserTsConfig());
    if(isUserTsConfig){
        customizeConfig = require(getUserTsConfig())
    }

    // 合并用户自定义的 tsconfig
    return {
        ...tsConfig.compilerOptions,
        ...customizeConfig.compilerOptions,
    }
}


const getUserTsConfig = () => {
    return path.resolve(process.cwd(), 'tsconfig.json')
}
module.exports = {
    babelify
}