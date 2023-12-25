const path = require('path');
// const vue = require('@vitejs/plugin-vue')
const vue = require('./plugins/plugin-vue')

module.exports = {
  resolve:{
    alias:{
      "@":path.resolve( "src"),
    },
 
  },
  server:{
    host: true,
  },
  plugins:[vue()]

}
