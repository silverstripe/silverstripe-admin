import React, {PropTypes} from 'react';
import { Button } from 'reactstrap';
import classnames from 'classnames';
import i18n from 'i18n';

const BACKSPACE = 8;
const DELETE = 46;

/**
 * Detect the keydown on the delete or backspace key.
 * @param e KeyDown event.
 * @param key Key tag to trigger.
 * @param onDelete Function to trigger when the delete key is press.
 * @param onBackSpace Function to trigger when the backspace key is press.
 * @return void
 */
const onKeyDown = (e, key, onDelete, onBackSpace) => {
  switch (e.keyCode) {
    case BACKSPACE:
      onBackSpace(key);
      break;
    case DELETE:
      onDelete(key);
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
  (label || key) + (value ? ':' + value : '')
);

/**
 * Component to display a tag the user can interact with.
 */
const Tag = ({
  onClick, onDelete, deletable, dataKey, label, value, onBackSpace, children, focusable, ...props
}) => (
  <Button
    {...props}
    className={ classnames("Tag", {"Tag__deletable": deletable}) }
    onClick={(e) => { e.preventDefault(); onClick(dataKey); } }
    href="#"
    tabIndex={focusable ? undefined : -1}
    onKeyDown={(e) => {onKeyDown(e, dataKey, onDelete, onBackSpace)}}>
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
  onBackSpace: PropTypes.func,
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
  onBackSpace: () => {},
  focusable: true,
};

export default Tag;
