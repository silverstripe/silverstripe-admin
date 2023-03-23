import { defaultTag } from './tags';
import { getSingularName, getFields, getFragments, getMutationParams, getMutationVariables } from './helpers';

const buildCreateMutation = (tag = defaultTag) => (
  tag`mutation Create${getSingularName}${getMutationVariables} {
    create${getSingularName}${getMutationParams} {
      ${getFields}
    }
  }
  ${getFragments}`
);

export default buildCreateMutation;
