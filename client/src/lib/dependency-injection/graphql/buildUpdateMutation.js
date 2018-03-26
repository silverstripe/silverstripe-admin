import { defaultTag } from './tags';
import { getSingularName, getVariables, getParams, getFields, getFragments } from './helpers';

const buildUpdateMutation = (tag = defaultTag) => {
  return tag`mutation Update${getSingularName}(
    $Input:${getSingularName}UpdateInputType!
    ${getVariables}
  ) {
    update${getSingularName}(
      Input: $Input
      ${getParams}
    ) {
      ${getFields}
    }
  }
  ${getFragments}`;
};

export default buildUpdateMutation;
