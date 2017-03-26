const fs = require("fs")

module.exports = function (files) {
    let _pending = 0

    return new Promise((resolve, reject) => {
        if (files.length === 0) return resolve(files)

        files.forEach(file => {
            _pending++
            fs.unlink(file, err => {
                if (err) return reject(err)
                if (--_pending === 0) return resolve(files)
            })
        })
    })
}