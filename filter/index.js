const dir = require("./filterDir")

exports.file = require("./filterFile")

exports.dir = (function(cwd) {
    return function(config) {
        return dir(cwd, config)
    }
})(process.cwd())

exports.rf = require("./rf")