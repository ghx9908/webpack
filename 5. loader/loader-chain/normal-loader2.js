function loader(source) {
  console.log("narmal loader2")
  return source + "//narmal loader2"
}
loader.pitch = () => {
  console.log("normal-loader2-pitch")
}
module.exports = loader
