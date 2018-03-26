import { defaultTag } from './tags';
import { getSingularName, getFields, getFragments } from './helpers';

const buildCreateMutation = (tag = defaultTag) => {
  return tag`mutation Create${getSingularName}(
    $Input:${getSingularName}CreateInputType!
  ) {
    create${getSingularName}(
      Input: $Input
    ) {
      ${getFields}
    }
  }
  ${getFragments}`;
};

export default buildCreateMutation;
