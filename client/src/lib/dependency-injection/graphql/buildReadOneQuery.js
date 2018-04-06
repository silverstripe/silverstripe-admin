import { defaultTag } from './tags';
import { getSingularName, getFields, getFragments } from './helpers';

const buildReadOneQuery = (tag = defaultTag) => (
  tag`query ReadOne${getSingularName}($ID: ID!)  {
    readOne${getSingularName}(ID: $ID) {
      ${getFields}
    }
  }
  ${getFragments}`
);

export default buildReadOneQuery;
