import { defaultTag } from './tags';
import { getSingularName, getVariables, getParams, getFields, getFragments } from './helpers';

const buildUpdateMutation = (tag = defaultTag) => (
  tag`mutation Update${getSingularName}(
    $input:${getSingularName}UpdateInputType!
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
