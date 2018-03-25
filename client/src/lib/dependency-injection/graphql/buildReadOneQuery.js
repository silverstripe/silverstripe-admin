import { defaultTag } from './tags';
import { getSingularName, getFields, getFragments } from './helpers';

export default function buildReadOneQuery(tag = defaultTag) {
  return tag`query ReadOne${getSingularName}($ID: ID!)  {
    readOne${getSingularName}(ID: $ID) {
      ${getFields}
    }
  }
  ${getFragments}`;
}
