import babel from '@rollup/plugin-babel';
/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input:'src/main.js',
  output:{
    file:'dist/bundle.js',
    format:'cjs',//amd | umd | iife |es |cjs
    name:"bundleName"//format为iife和umd时必须
  },
  plugins:[babel({
   exclude:'/node_modules/**'
  })]
}
