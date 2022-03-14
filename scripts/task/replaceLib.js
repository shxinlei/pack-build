#!/usr/bin/env node

const { join, dirname } = require('path');
const fs = require("fs");

const replacePath = (path) => {
    let nodeEnv = path.node.source;
    let nodeCreate = /\/lib\//.test(nodeEnv?.value)

    if (nodeCreate) {
        const esModule = nodeEnv?.value.replace("/scripts/", "/es/");
        // 创建 es 目录
        const esPath = dirname(join(process.cwd(), `node_modules/${esModule}`));

        // 如果es路径存在
        if(fs.existsSync(esPath)){
            console.log(`[es build] 替换 ${nodeEnv?.value} 为 ${esModule}`);
            nodeEnv.value = esModule;
        }
    }
}


const replaceLib = () => {

    return {
        visitor: {
            ImportDeclaration: replacePath,
            ExportNamedDeclaration: replacePath
        }
    }
}

module.exports = replaceLib;