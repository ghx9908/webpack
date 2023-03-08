const less = require("less")
function loader(source) {
  let callback = this.async()
  less.render(source, { filename: this.resource }, (err, output) => {
    callback(err, `module.exports = ${JSON.stringify(output.css)}`)
    // callback(err, output.css)
  })
}
module.exports = loader
