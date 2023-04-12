import { defaultTag } from './tags';
import { getSingularName, getCreateMutationType, getFields, getFragments } from './helpers';

const buildCreateMutation = (tag = defaultTag) => (
  tag`mutation Create${getSingularName}(
    $input:${getCreateMutationType}!
  ) {
    create${getSingularName}(
      input: $input
    ) {
      ${getFields}
    }
  }
  ${getFragments}`
);

export default buildCreateMutation;
