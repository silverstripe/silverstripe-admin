import { defaultTag } from './tags';
import { getSingularName, getFields, getFragments } from './helpers';

const buildDeleteMutation = (tag = defaultTag) => {
  return tag`mutation Delete${getSingularName}(
    $Input:${getSingularName}DeleteInputType!
  ) {
    delete${getSingularName}(
      Input: $Input
    ) {
      ${getFields}
    }
  }
  ${getFragments}`;
};

export default buildDeleteMutation;
