//第三种写法
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          ie: "11",
        },
      },
    ],
  ],
}
