import { defaultTag } from './tags';
import { getPluralName, getVariables, getRootParams, getFields, getFragments } from './helpers';

const buildReadQuery = (tag = defaultTag) => (
  tag`query Read${getPluralName}${getVariables} {
    read${getPluralName}${getRootParams} {
      ${getFields}
    }
  }
  ${getFragments}`
);

export default buildReadQuery;
