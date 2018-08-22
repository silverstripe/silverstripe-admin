import React, { PropTypes } from 'react';
import { Button } from 'reactstrap';
import classnames from 'classnames';
import i18n from 'i18n';

/**
 * Backspace key code.
 * @type {number}
 */
const BACKSPACE = 8;

/**
 * Delete key code.
 * @type {number}
 */
const DELETE = 46;

/**
 * Left arrow key.
 * @type {number}
 */
const LEFT_ARROW = 37;

/**
 * Right arrow key
 * @type {number}
 */
const RIGHT_ARROW = 39;

/**
 * High jack some keys to fire off matching events.
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
    default:
      // Let the browser handle all other cases natively.
      break;
  }
};

/**
 * Combine the key, label and value to generate the text of the tag.
 * @param key Key of tag. Will be used as fallback if label is not provide
 * @param label Text to attach to the tag.
 * @param value Optional value attached to the tag.
 * @returns {string}
 */
const makeLabel = (key, label, value) => (
  (label || key) + (value ? `:${value}` : '')
);

/**
 * Component to display a tag the user can interact with.
 */
const Tag = ({
  onClick, onDelete, onDeleteKey, onBackSpace, onPrevious, onNext,
  deletable, dataKey, label, value, children, focusable, ...props
}) => (
  <Button
    {...props}
    className={classnames('tag', 'btn-sm', { tag__deletable: deletable })}
    onClick={(e) => { e.preventDefault(); onClick(dataKey); }}
    href="#"
    tabIndex={focusable ? undefined : -1}
    onKeyDown={(e) => { onKeyDown(e, dataKey, onDeleteKey, onBackSpace, onPrevious, onNext); }}
  >
    { deletable && <DeleteButton onDelete={onDelete} dataKey={dataKey} focusable={focusable} /> }
    { children || makeLabel(dataKey, label, value) }
  </Button>
);

/**
 * Optional _remove tag_ button displayed in the tag.
 * @param dataKey
 * @param onDelete
 * @param focusable
 * @returns {*}
 * @constructor
 */
const DeleteButton = ({ dataKey, onDelete, focusable }) => (
  <Button
    onClick={(e) => { e.stopPropagation(); e.preventDefault(); onDelete(dataKey); }}
    aria-label={i18n._t('Admin.REMOVE_TAG', 'Remove Tag')}
    tabIndex={focusable ? undefined : -1}
    className="tag__delete font-icon-cancel btn--no-text btn--icon-sm"
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
