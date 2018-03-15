import { defaultTag } from './tags';
import { getPluralName, getVariables, getParams, getFields, getFragments } from './helpers';

export default function buildReadQuery(tag = defaultTag) {
  return tag`query Read${getPluralName}(${getVariables}) {
    read${getPluralName}(${getParams}) {
      ${getFields}
    }
  }
  ${getFragments}`;
}
