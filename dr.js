#!/usr/bin/env node

const program = require("commander")
const del = require("del")  // 删除文件和文件夹的模块
const rm = require("./lib/remove")  // 备用删除方案
const moveFiles = require("./lib/moveFiles")  // 备用删除方案

const package = require("./package.json")
const filter = require("./filter")

// 定义命令行参数和帮助文档
program
    .version(package.version)
    .description(`  ${package.description}`)
    .option('-i, --ignore <dirname>', '忽略的文件夹(以,连接多个)')    // <>dirname的参数
    .option('-r, --reomve', '是否直接删除重复文件(默认移动到统一文件夹)')
    .on('--help', function () {
        console.log('  Example:')
        console.log('')
        console.log('    $ dr -i node_modules,.git')
        console.log('    $ dr -i node_modules,.git -r')
        console.log('')
    })

// 开始解析命令行参数
program.parse(process.argv)

let config = {
    ignore: ["重复的文件", ...(program.ignore && program.ignore.split(',') || [])],
    isDelete: !!program.remove
}

filter
    .filePaths(config)
    .then(files => {
        if (!files.length) return console.log('已经没有重复的文件啦！！！')
        if (config.isDelete) {
            return del(files)
                .then(paths => {
                    // 当del并没有删除筛选出的重复文件时启用备用方案
                    if (!paths.length) return rm.file(files)
                    return Promise.resolve()
                })
        } else {
            return moveFiles(files, "重复的文件")
        }
    })
    .then(() => {
        return filter.dirPaths(process.cwd(), config)
    })
    .then(dirs => {
        // return console.log(dirs)
        return del(dirs).then(paths => {
            // 当del并没有删除筛选出的空目录时启用备用方案
            if (!paths.length && dirs.length) return rm.dir(dirs)
            return Promise.resolve()
        })
    })
    .catch(err => {
        console.log(err)
        process.exit(1)
    })