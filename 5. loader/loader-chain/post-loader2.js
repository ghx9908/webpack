function loader(source) {
  console.log("post loader2")
  return source + "//post loader2"
}
loader.pitch = () => {
  console.log("post-loader2-pitch")
}
module.exports = loader
