var a = 1;
function one() {
  var b = 1;
  function two() {
    var c = 2;
     console.log(a, b, c);
  }
}
let Scope = require('./scope');
let globalScope = new Scope({ name: 'global', names: ['a'], parent: null });
let oneScope = new Scope({ name: 'one', names: ['b'], parent: globalScope });
let twoScope = new Scope({ name: 'two', names: ['c'], parent: oneScope });
console.log(
  twoScope.findDefiningScope('a').name,
  twoScope.findDefiningScope('b').name,
  twoScope.findDefiningScope('c'),
  twoScope.findDefiningScope('d')
)
