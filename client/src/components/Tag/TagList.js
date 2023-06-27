import React from 'react';
import Tag from 'components/Tag/Tag';
import PropTypes from 'prop-types';
import TagPropType from './TagPropType';

/**
 * Whatever the focus should move forward.
 * @type {boolean}
 */
const FORWARD = true;

/**
 * Whatever the focus should move backwards
 * @type {boolean}
 */
const BACKWARD = false;

/**
 * Move the focus to a sibling in the tag list.
 * @param bool direction Whatever the focus should move backwards or forwards.
 * @returns {boolean} Whatever a sibling was found in the requested direction.
 */
const moveFocus = (direction) => {
  const sibling = document.activeElement[
    direction ? 'nextElementSibling' : 'previousElementSibling'
  ];

  if (sibling) {
    sibling.focus();
    return true;
  }

  return false;
};

/**
 * Group a list of tags together. Tag can be interacted with by clicking on them or removing them.
 * Some key event are overwritten to make it easier to navigate the tags:
 * * Backspace is assume to remove a tag and move the focus backwards.
 * * Delete is assume to remove a tag and move the focus forward.
 * * Arrow keys can be used to move the focus from tag to tag.
 *
 * @param TagPropType[] tags Data used to generated the tags.
 * @param bool deletable Whatever the tags should have a delete action.
 * @param bool focusable Whatever the tags should be in the focus order.
 * @param func onTagDelete Handler for when the delete action of a tag is triggered. The key of the
 * tag to delete is passed as an argument.
 * @param func onTagClick Handler for when a tag is clicked. The key of the tag is passed as an
 * argument.
 * @param func onHolderFocus Handler for when actions on the tags would causes it to loose focus and
 * the focus should be return to the parent component.
 * @returns {*}
 * @constructor
 */
const TagList = ({ tags, deletable, focusable, onTagDelete, onTagClick, onHolderFocus }) => {
  const onDeleteKey = (key) => {
    // eslint-disable-next-line  no-unused-expressions
    moveFocus(FORWARD) || onHolderFocus();
    onTagDelete(key);
  };

  const onBackSpace = (key) => {
    // eslint-disable-next-line  no-unused-expressions
    moveFocus(BACKWARD) || moveFocus(FORWARD) || onHolderFocus();
    onTagDelete(key);
  };

  return (
    <ul className="tag-list">
      {tags.map((props) => (
        <Tag
          {...props}
          tag="li"
          deletable={deletable}
          dataKey={props.key}
          focusable={focusable}
          onDelete={onTagDelete}
          onDeleteKey={deletable && onTagDelete ? onDeleteKey : undefined}
          onBackSpace={deletable && onTagDelete ? onBackSpace : undefined}
          // eslint-disable-next-line  no-unused-expressions
          onNext={() => { moveFocus(FORWARD) || onHolderFocus(); }}
          onPrevious={() => { moveFocus(BACKWARD); }}
          onClick={onTagClick}
        />
      ))}
    </ul>
  );
};

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
