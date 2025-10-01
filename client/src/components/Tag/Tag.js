import React from 'react';
import Button from 'components/Button/Button';
import classnames from 'classnames';
import i18n from 'i18n';
import PropTypes from 'prop-types';

/**
 * High jack some keys to fire off matching events.
 * @param e KeyDown event.
 * @param key Key tag to trigger.
 * @param onDelete Function to trigger when the delete key is press.
 * @param onBackSpace Function to trigger when the backspace key is press.
 * @return void
 */
const onKeyDown = (e, key, onDeleteKey, onBackSpace, onPrevious, onNext) => {
  switch (e.key) {
    case 'Backspace':
      e.preventDefault();
      onBackSpace(key);
      break;
    case 'Delete':
      e.preventDefault();
      onDeleteKey(key);
      break;
    case 'ArrowLeft':
      e.preventDefault();
      onPrevious(key);
      break;
    case 'ArrowRight':
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
  (label || key) + (value ? `: ${value}` : '')
);

/**
 * Component to display a tag the user can interact with.
 */
const Tag = ({
  onClick, onDelete, onDeleteKey, onBackSpace, onPrevious, onNext,
  deletable, dataKey, label, value, children, focusable, ...props
}) => {
  const title = makeLabel(dataKey, label, value);
  return (
    <Button
      {...props}
      role="button"
      className={classnames('tag-component', 'btn-sm', { 'tag-component--deletable': deletable })}
      onClick={(e) => { e.preventDefault(); onClick(dataKey); }}
      tabIndex={focusable ? 0 : undefined}
      onKeyDown={(e) => { onKeyDown(e, dataKey, onDeleteKey, onBackSpace, onPrevious, onNext); }}
      title={title}
    >
      { deletable && <DeleteButton onDelete={onDelete} dataKey={dataKey} /> }
      { children || title }
    </Button>
  );
};

/**
 * Move focus to parent element. We don't want delete button to be focusable.
 * @param e
 */
const focusOnParent = (e) => {
  e.target.parentElement.focus();
};

/**
 * Optional _remove tag_ button displayed in the tag.
 * @param dataKey
 * @param onDelete
 * @param focusable
 * @returns {*}
 * @constructor
 */
const DeleteButton = ({ dataKey, onDelete }) => (
  <Button
    onClick={(e) => { e.stopPropagation(); e.preventDefault(); onDelete(dataKey); }}
    aria-label={i18n._t('Admin.REMOVE_TAG', 'Remove Tag')}
    title={i18n._t('Admin.REMOVE_TAG', 'Remove Tag')}
    onFocus={focusOnParent}
    tabIndex={-1}
    className="tag-component__delete btn--no-text btn--icon-sm"
    icon="cancel"
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
  tag: 'span',
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
