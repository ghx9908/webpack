import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  /* 你的配置 */
  input: 'src/main.js',
  output: [
    {
        file: 'bundle.js',
        format: 'cjs',
    },
    {
        file: 'bundle.min.js',
        format: 'iife',
        name: 'version',
        plugins: [terser()]
    }
],
  plugins: [json()]
};
export default config;




