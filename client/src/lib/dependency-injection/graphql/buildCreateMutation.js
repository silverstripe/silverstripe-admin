import { defaultTag } from './tags';
import { getSingularName, getFields, getFragments } from './helpers';

export default function buildCreateMutation(tag = defaultTag) {
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
}
