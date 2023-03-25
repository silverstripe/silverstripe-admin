import { defaultTag } from './tags';
import { getSingularName, getIdOnlyVariables, getFields, getFragments, getIdOnlyParams } from './helpers';

const buildReadOneQuery = (tag = defaultTag) => (
  tag`query ReadOne${getSingularName}${getIdOnlyVariables}  {
    readOne${getSingularName}${getIdOnlyParams} {
      ${getFields}
    }
  }
  ${getFragments}`
);

export default buildReadOneQuery;
