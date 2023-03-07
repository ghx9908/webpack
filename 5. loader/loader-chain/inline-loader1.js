function loader(source) {
  console.log("inline loader1")
  return source + "//inline loader1"
}
loader.pitch = (remainingRequest, previousRequest, data) => {
  //data.age = 100;
  console.log("inline-loader1-pitch")
}
module.exports = loader
