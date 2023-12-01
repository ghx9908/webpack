const resolve = require('resolve');
console.log(resolve.sync('vue'));
//C:\aproject\xxx\vite50\node_modules\vue\index.js
console.log(require.resolve('vue'));
//C:\aproject\xxx\vite50\node_modules\vue\index.js
