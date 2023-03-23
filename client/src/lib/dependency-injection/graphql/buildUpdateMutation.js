import { defaultTag } from './tags';
import { getSingularName, getMutationVariables, getMutationParams, getFields, getFragments } from './helpers';

const buildUpdateMutation = (tag = defaultTag) => (
  tag`mutation Update${getSingularName}${getMutationVariables} {
    update${getSingularName}${getMutationParams} {
      ${getFields}
    }
  }
  ${getFragments}`
);

export default buildUpdateMutation;
