import { defaultTag } from './tags';

const getPluralName = ({ pluralName }) => pluralName;

const getVariables = ({ params, pagination }) => buildDefs(params, pagination);

const getParams = ({ params, pagination }) => buildArgs(params, pagination);

const getFields = ({ fields, pagination }) => mapFields(fields, pagination);

const getFragments = ({ availableFragments, fragments = [] }) => (
  // build up the list of fragments needed for this query but concatenating them together
  Object.entries(availableFragments)
    .reduce((capturedFragments, [key, fragment]) => (
      (fragments.includes(key))
        ? `${capturedFragments} ${fragment}`
        : capturedFragments
    ))
);

export default function buildReadQuery(tag = defaultTag) {
  return tag`query Read${getPluralName}(${getVariables}) {
    read${getPluralName}(${getParams}) {
      ${getFields}
    }
  }
  ${getFragments}`;
}
