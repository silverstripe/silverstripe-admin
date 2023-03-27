import { defaultTag } from './tags';
import { getSingularName } from './helpers';

const buildDeleteMutation = (tag = defaultTag) => (
  tag`mutation Delete${getSingularName}($IDs:[ID]!) {
    delete${getSingularName}(IDs: $IDs)
  }`
);

export default buildDeleteMutation;
