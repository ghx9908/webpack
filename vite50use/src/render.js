import { sum } from './sum.js';
export function render() {
  app.innerHTML = 'title';
  console.log('sum(1,2)=>',sum(1,2))
}

// {"type":"update","updates":[{"type":"js-update","timestamp":1703488114932,"path":"/src/main.js","explicitImportRequired":false,"acceptedPath":"/src/render.js"}]}	
