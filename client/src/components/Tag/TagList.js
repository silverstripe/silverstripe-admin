import React, { PropTypes } from 'react';
import Tag from 'components/Tag/Tag';
import TagPropType from './TagPropType';

const FORWARD = true;
const BACKWARD = false;

const moveFocus = (direction) => {
  const sibling = document.activeElement[direction ? 'nextElementSibling' : 'previousElementSibling'];

  if (sibling) {
    sibling.focus();
    return true;
  }

  return false;
};

const TagList = ({ tags, deletable, focusable, onTagDelete, onTagClick, onHolderFocus }) => (
  <div className="TagList">
    { tags.map((props) => (
      <Tag
        {...props}
        deletable={deletable}
        dataKey={props.key}
        focusable={focusable}
        onDelete={onTagDelete}
        // eslint-disable-next-line no-unused-expressions
        onDeleteKey={(key) => { moveFocus(FORWARD) || onHolderFocus(); onTagDelete(key); }}
        onBackSpace={(key) => {
          // eslint-disable-next-line no-unused-expressions
          moveFocus(BACKWARD) || moveFocus(FORWARD) || onHolderFocus();
          onTagDelete(key);
        }}
        // eslint-disable-next-line no-unused-expressions
        onNext={() => { moveFocus(FORWARD) || onHolderFocus(); }}
        onPrevious={() => { moveFocus(BACKWARD); }}
        onClick={onTagClick}
      />
    ))}
  </div>
);

TagList.propTypes = {
  onTagClick: PropTypes.func,
  onTagDelete: PropTypes.func,
  onHolderFocus: PropTypes.func,
  deletable: PropTypes.bool,
  tags: PropTypes.arrayOf(TagPropType),
  focusable: PropTypes.bool,
};

TagList.defaultProps = {
  deletable: false,
  focusable: true,
  onTagDelete: () => {},
  onTagClick: () => {},
  onHolderFocus: () => {}
};

export { TagList as Component };
export default TagList;
