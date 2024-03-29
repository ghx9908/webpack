import build from './plugins/rollup-plugin-build.js';
import generation from './plugins/rollup-plugin-generation.js';
export default {
  input: "./src/index.js",
  output: {
    dir: 'dist',
  },
  plugins: [
    build(), // 调用自定义的构建插件
    generation()
  ]
}
