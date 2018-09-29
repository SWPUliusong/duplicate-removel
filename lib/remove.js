const fs = require("fs")
const promisify = require("util").promisify

exports.rmdir = function (dirs) {
    let promises = []

    if (dirs.length > 0) {
        dirs.forEach(dir => {
            promises.push(promisify(fs.rmdir)(dir))
        })

        return Promise.all(promises)
    }
}

exports.rmfile = function (files) {
    let promises = []

    if (files.length > 0) {
        files.forEach(file => {
            promises.push(promisify(fs.unlink)(file))
        })

        return Promise.all(promises)
    }
}