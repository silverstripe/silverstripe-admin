import { defaultTag } from './tags';
import { getVariables, getParams, getFields, getFragments } from './helpers';

const getOperationName = ({ operationName, queryName }) => (
  operationName ||
  `${queryName.charAt(0).toUpperCase()}${queryName.slice(1)}`
);

const getQueryName = ({ queryName }) => queryName;

const getQueryType = ({ queryType }) => queryType;

export default function buildReadQuery(tag = defaultTag) {
  return tag`${getQueryType} ${getOperationName}${getVariables} {
    ${getQueryName}${getParams} {
      ${getFields}
    }
  }
  ${getFragments}`;
}
