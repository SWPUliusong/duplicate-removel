const path = require("path")
const fs = require("fs")

let stat = null;

function ls(dir, _pending, _result, opts) {
    if ([].slice.call(arguments).length === 2) {
        opts = _pending;
        _pending = null;
    }

    _pending = _pending ? _pending++ : 1;
    _result = _result || [];
    opts = opts || {};

    try {
        stat = fs.lstatSync(dir);
    } catch (err) {
        throw err;
    };

    if (stat.isDirectory()) {
        let subDirs = fs.readdirSync(dir);
        // 忽略ignore指明的文件夹
        if (opts.ignore instanceof Array) {
            subDirs = subDirs.filter(function(dirname) {
                return opts.ignore.indexOf(dirname) === -1
            })
        }
        
        subDirs.forEach(function (part) {
            ls(path.join(dir, part), _pending, _result, opts);
        });
        if (--_pending === 0) {
            return _result;
        }
    } else {
        _result.push(dir);
        if (--_pending === 0) {
            return _result;
        }
    }
};

module.exports = ls