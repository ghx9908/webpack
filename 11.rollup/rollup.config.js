import babel from "@rollup/plugin-babel"
import resolve from '@rollup/plugin-node-resolve';// 解析node_modules中的模块
import commonjs from '@rollup/plugin-commonjs'; //将CommonJS模块转换为ES6
/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: "src/main.js",
  output: {
    file: "dist/bundle.js",
    format: "cjs", //amd | umd | iife |es |cjs
    name: "bundleName", //format为iife和umd时必须
  },
  plugins: [
    babel({
      exclude: "/node_modules/**",
    }),
    resolve(),//作用是可以加载node_modules里有的模块
    commonjs(),//可以支持commonjs语法
  ],
}
