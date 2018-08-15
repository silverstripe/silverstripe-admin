import React, {PropTypes} from 'react';
import { Button } from 'reactstrap';
import classnames from 'classnames';
import i18n from 'i18n';

const BACKSPACE = 8;
const DELETE = 46;
const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;

/**
 * Detect the keydown on the delete or backspace key.
 * @param e KeyDown event.
 * @param key Key tag to trigger.
 * @param onDelete Function to trigger when the delete key is press.
 * @param onBackSpace Function to trigger when the backspace key is press.
 * @return void
 */
const onKeyDown = (e, key, onDeleteKey, onBackSpace, onPrevious, onNext) => {
  switch (e.keyCode) {
    case BACKSPACE:
      e.preventDefault();
      onBackSpace(key);
      break;
    case DELETE:
      e.preventDefault();
      onDeleteKey(key);
      break;
    case LEFT_ARROW:
      e.preventDefault();
      onPrevious(key);
      break;
    case RIGHT_ARROW:
      e.preventDefault();
      onNext(key);
      break;
  }
};

/**
 * Generate a label text
 * @param key Key of tag. Will be used as fallback if label is not provide
 * @param label Text to attach to the tag.
 * @param value Optional value attached to the tag.
 * @returns {string}
 */
const makeLabel = (key, label, value) => (
  (label || key) + (value ? ': ' + value : '')
);

/**
 * Component to display a tag the user can interact with.
 */
const Tag = ({
  onClick, onDelete, deletable, dataKey, label, value, onDeleteKey, onBackSpace, onPrevious, onNext, children, focusable, ...props
}) => (
  <Button
    {...props}
    className={ classnames("Tag", {"Tag__deletable": deletable}) }
    onClick={(e) => { e.preventDefault(); onClick(dataKey); } }
    href="#"
    tabIndex={focusable ? undefined : -1}
    onKeyDown={(e) => {onKeyDown(e, dataKey, onDeleteKey, onBackSpace, onPrevious, onNext)}}>
    { deletable && <DeleteButton onDelete={onDelete} dataKey={dataKey} focusable={focusable} /> }
    { children || makeLabel(dataKey, label, value) }
  </Button>
);

const DeleteButton = ({dataKey, onDelete, focusable}) => (
  <Button
    onClick={ (e) => {
      e.stopPropagation();
      e.preventDefault();
      onDelete(dataKey); } }
    aria-label={i18n._t('Admin.REMOVE_TAG', 'Remove Tag')}
    tabIndex={focusable ? undefined : -1}
    className="Tag__Delete font-icon-cancel btn--no-text btn--icon-sm"
  />
);


Tag.propTypes = {
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
  onDeleteKey: PropTypes.func,
  onBackSpace: PropTypes.func,
  onPrevious: PropTypes.func,
  onNext: PropTypes.func,
  deletable: PropTypes.bool,
  dataKey: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  title: PropTypes.string,
  focusable: PropTypes.bool,
};

Tag.defaultProps = {
  deletable: false,
  onClick: () => {},
  onDelete: () => {},
  onDeleteKey: () => {},
  onBackSpace: () => {},
  onPrevious: () => {},
  onNext: () => {},
  focusable: true,
};

export default Tag;
