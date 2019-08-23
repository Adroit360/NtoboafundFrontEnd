import { Scholarship } from './models/scholarship';

// export function groupBy(array,key):any{
//     array.reduce((objectsByKeyValue, obj) => {
//         const value = obj[key];
//         objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
//         return objectsByKeyValue;
//       }, {});
// } 
export const groupBy = key => array =>
array.reduce((objectsByKeyValue, obj) => {
  const value = obj[key];
  objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
  return objectsByKeyValue;
}, {});