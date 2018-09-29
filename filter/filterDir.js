const path = require("path")
const fs = require("fs")
const exec = require("child_process").exec

let stat, args;

// 检测是否为空文件夹
function emptyCheck(dir) {
    return new Promise((resolve, reject) => {
        exec('du -s -b', {
            cwd: dir
        }, (err, stdout) => {
            if (err) return reject(err);
            stdout = parseInt(stdout)
            if (stdout > 0) resolve(false)
            else resolve(true)
        })
    })
}

async function filterDir(dir, opts = {}) {
    try {
        let stat = fs.lstatSync(dir);
        let result = []
        if (stat.isDirectory()) {
            let isEmpty = await emptyCheck(dir)
            if (isEmpty && process.cwd() !== dir) {
                return [dir]
            } else {
                let subDirs = fs.readdirSync(dir);
                // 忽略ignore指明的文件夹
                if (opts.ignore instanceof Array) {
                    subDirs = subDirs.filter(function (dirname) {
                        return opts.ignore.indexOf(dirname) === -1
                    })
                }
                for (let i = 0, len = subDirs.length; i < len; i++) {
                    let dirArr = await filterDir(path.join(dir, subDirs[i]), opts);
                    result = result.concat(dirArr)
                }
            }
        }
        return result
    } catch (err) {
        throw err;
    };
}

module.exports = filterDir