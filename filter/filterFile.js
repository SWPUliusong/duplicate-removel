const ls = require("./ls")
const fs = require("fs")
const crypto = require("crypto")

function hash(buf) {
    return crypto.createHash('md5').update(buf).digest('hex')
}

module.exports = function (config) {
    let _result = [], _hashMap = {}, _pending = 0;

    return new Promise((resolve, reject) => {
        let files = ls(process.cwd(), config)

        if (files.length === 0) return resolve(_result)

        files.forEach(function (file) {
            _pending++
            fs.readFile(file, function (err, data) {
                if (err) return reject(err)

                // 重复检测
                let key = hash(data)
                if (!_hashMap[key]) {
                    _hashMap[key] = file
                } else {
                    if (config.short) {
                        if (_hashMap[key].length > file.length) {
                            _result.push(_hashMap[key])
                            _hashMap[key] = file
                        } else {
                            _result.push(file)
                        }
                    } else {
                        _result.push(file)
                    }
                }

                // 异步任务结束
                if (--_pending === 0) {
                    resolve(_result)
                }
            })
        })
    })
}