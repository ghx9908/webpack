import { name, age } from './msg';
import {age1} from './age1'
import {age2} from './age2'
function say() {
  console.log('hello', name);
}
console.log('age=>',age1,age2)
say();
if(true){
  var address = '北京';
}
console.log('address=>',address)
