const ls = require("./ls")
const fs = require("fs")
const crypto = require("crypto")
const co = require("co")

function hash(buf) {
    return crypto.createHash('md5').update(buf).digest('hex')
}

function readFile(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, function (err, data) {
            if (err) return reject(err)
            resolve(data)
        })
    })
}

module.exports = function (config) {
    let _result = [], _hashMap = {}, _pending = 0;

    return co(function* () {
        let files = ls(process.cwd(), config)

        if (files.length === 0) return _result

        for (let i = 0, len = files.length; i < len; i++) {
            let file = files[i]
            let key = hash(yield readFile(file))
            if (!_hashMap[key]) {
                _hashMap[key] = file
            } else {
                if (config.short && _hashMap[key].length > file.length) {
                    _result.push(_hashMap[key])
                    _hashMap[key] = file
                } else {
                    _result.push(file)
                }
            }
        }

        return _result
    })
}