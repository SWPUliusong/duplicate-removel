const fs = require("fs")

module.exports = function (dirs) {
    let _pending = 0, finished = []

    return new Promise((resolve, reject) => {
        if (dirs.length === 0) return resolve(dirs)

        dirs.forEach(file => {
            _pending++
            fs.rmdir(file, err => {
                if (!err) {
                    finished.push(file)
                }
                if (--_pending === 0) return resolve(finished)
            })
        })
    })
}