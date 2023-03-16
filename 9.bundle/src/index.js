import("./title.js").then((module) => {
  console.log(module.default)
  import("./title.js").then((module) => {
    console.log(module.default)
  })
})
