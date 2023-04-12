import { defaultTag } from './tags';
import { getSingularName, getFields, getFragments } from './helpers';

const buildCreateMutation = (tag = defaultTag) => (
  tag`mutation Create${getSingularName}(
    $input:${getSingularName}CreateInputType!
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
