import { defaultTag } from './tags';
import { getSingularName, getIdOnlyVariables, getIdOnlyParams } from './helpers';

const buildDeleteMutation = (tag = defaultTag) => (
  tag`mutation Delete${getSingularName}${getIdOnlyVariables} {
    delete${getSingularName}${getIdOnlyParams}
  }`
);

export default buildDeleteMutation;
