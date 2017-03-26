#!/usr/bin/env node

const program = require("commander")
const del = require("del")  // 删除文件和文件夹的模块

const filter = require("./filter")
const rm = require("./remove")  // 备用删除方案

// 定义命令行参数和帮助文档
program
    .version('1.0.0')
    .description('  去除文件夹下重复的文件')
    .option('-i, --ignore <dirname>', '忽略的文件夹(以,连接多个)')    // <>dirname的参数
    .option('-s, --short', '路径深度更小或名字更短的优先保留')
    .option('-a, --allow-empty', '允许空文件夹存在 (默认删除空文件夹)')
    .on('--help', function () {
        console.log('  Example:')
        console.log('')
        console.log('   $ dr -s')
        console.log('   $ dr -i node_modules,.git')
        console.log('   $ dr -i node_modules,.git -s')
        console.log('')
    })

// 开始解析命令行参数
program.parse(process.argv)

let postfix = '    --->    已删除\n'
console.log('')

filter.file({
    ignore: program.ignore && program.ignore.split(','),
    short: program.short
}).then(files => {
    if (!files.length) return console.log('没有重复的文件')
    return del(files).then(paths => {
        // 当del并没有删除筛选出的重复文件时启用备用方案
        if (!paths.length) return rm.file(files)
        return Promise.resolve(paths)
    })
}).then(files => {
    if (files && files.length) {
        console.log('以下重复文件被删除: ')
        let msg = files.join(postfix)
        console.log(msg + postfix)
    }

    if (!program.allowEmpty) {
        return filter.dir({
            ignore: program.ignore && program.ignore.split(',')
        })
    } else {
        return Promise.reject('空白文件夹被保留')
    }
}).then(dirs => {
    return del(dirs).then(paths => {
        // 当del并没有删除筛选出的空目录时启用备用方案
        if (!paths.length && dirs.length) return rm.dir(dirs)
        return Promise.resolve(paths)
    })
}).then(dirs => {
    if (!dirs.length) return console.log('没有空白文件夹被删除')
    console.log('以下空白文件夹被删除: ')
    let msg = dirs.join(postfix)
    console.log(msg + postfix)
}).catch(err => {
    console.log(err)
    process.exit(1)
})