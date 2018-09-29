const ls = require("../lib/ls")
const fileToHash = require("../lib/fileToMd5")

module.exports = async function (config) {
    let _result = [], _hashMap = {}, _pending = 0;

    let filePaths = ls(process.cwd(), config)

    if (filePaths.length === 0) return _result

    for (let i = 0, len = filePaths.length; i < len; i++) {
        let filePath = filePaths[i]
        let key = await fileToHash(filePath)
        if (!_hashMap[key]) {
            _hashMap[key] = filePath
        } else {
            if (_hashMap[key].length > filePath.length) {
                _result.push(_hashMap[key])
                _hashMap[key] = filePath
            } else {
                _result.push(filePath)
            }
        }
    }

    return _result
}