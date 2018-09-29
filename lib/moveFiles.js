const fs = require("fs")
const path = require("path")

let cwd = process.cwd()

module.exports = function (targets, dirname) {
  let dir = path.resolve(cwd, dirname)

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  targets.forEach(item => {
    let basename = path.basename(item)
    fs.renameSync(item, path.resolve(dir, basename))
  })
}