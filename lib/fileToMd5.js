const crypto = require("crypto")
const fs = require("fs")

function createHash(filePath) {
  let hash = crypto.createHash('md5')
  return new Promise((resolve, reject) => {
    let readStream = fs.createReadStream(filePath)
    readStream.on("data", data => {
      hash.update(data)
    })

    readStream.on("end", () => {
      resolve(hash.digest('hex'))
    })

    readStream.on("error", err => reject(err))

  })
}

module.exports = createHash
