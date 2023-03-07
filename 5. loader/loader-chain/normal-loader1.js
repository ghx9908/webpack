function loader(source) {
  console.log("narmal loader1")
  return source + "//narmal loader1"
}
loader.pitch = () => {
  console.log("normal-loader1-pitch")
}
module.exports = loader
