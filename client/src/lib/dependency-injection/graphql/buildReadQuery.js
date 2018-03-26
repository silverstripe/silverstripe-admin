import { defaultTag } from './tags';
import { getPluralName, getVariables, getParams, getFields, getFragments } from './helpers';

const buildReadQuery = (tag = defaultTag) => {
  return tag`query Read${getPluralName}${getVariables} {
    read${getPluralName}${getParams} {
      ${getFields}
    }
  }
  ${getFragments}`;
};

export default buildReadQuery;
