const path = require("path")
const fs = require("fs")
const exec = require("child_process").exec
const co = require("co")

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

function filterDir(dir, _result, opts) {
    args = [].slice.call(arguments)
    return co(function* () {
        if (args.length === 2) {
            opts = _result;
            _result = null;
        }

        _result = _result || [];
        opts = opts || {};

        try {
            stat = fs.lstatSync(dir);
        } catch (err) {
            throw err;
        };

        if (stat.isDirectory()) {
            if ((yield emptyCheck(dir)) && process.cwd() !== dir) _result.push(dir)
            else {
                let subDirs = fs.readdirSync(dir);
                // 忽略ignore指明的文件夹
                if (opts.ignore instanceof Array) {
                    subDirs = subDirs.filter(function (dirname) {
                        return opts.ignore.indexOf(dirname) === -1
                    })
                }

                for (let i = 0, len = subDirs.length; i < len; i++) {
                    _result = yield filterDir(path.join(dir, subDirs[i]), _result, opts);
                }
            }
        }
        return _result
    })
};

module.exports = filterDir