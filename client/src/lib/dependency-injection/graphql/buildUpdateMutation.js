import { defaultTag } from './tags';
import { getSingularName, getUpdateMutationType, getVariables, getParams, getFields, getFragments } from './helpers';

const buildUpdateMutation = (tag = defaultTag) => (
  tag`mutation Update${getSingularName}(
    $input:${getUpdateMutationType}!
    ${getVariables}
  ) {
    update${getSingularName}(
      input: $input
      ${getParams}
    ) {
      ${getFields}
    }
  }
  ${getFragments}`
);

export default buildUpdateMutation;
