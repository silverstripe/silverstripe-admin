import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { UncontrolledPopover, PopoverBody } from 'reactstrap';
import i18n from 'i18n';
import classNames from 'classnames';
import Button from '../Button/Button';

/**
 * List of values that can be passed in the `type` prop of the `<Tip />` component.
 * @type {{TITLE: string, INPUT_GROUP: string}}
 */
export const TIP_TYPES = {
  TITLE: 'title',
  INPUT_GROUP: 'input-group',
};

/**
 * List of values that can be passed in the `importance` prop of the `<Tip />` component.
 * This is only applicable for the TEXT_FIELD type
 * @type {{NORMAL: string, HIGH: string}}
 */
export const TIP_IMPORTANCE_LEVELS = {
  NORMAL: 'normal',
  HIGH: 'high',
};

/**
 * Unique attributes related to each `TIP_IMPORTANCE_LEVEL`.
 */
const tipImportanceMap = {
  [TIP_IMPORTANCE_LEVELS.NORMAL]: {
    iconColor: 'muted',
    description: i18n._t('Admin.NORMAL_TIP', 'Tip'),
  },
  [TIP_IMPORTANCE_LEVELS.HIGH]: {
    iconColor: 'danger',
    description: i18n._t('Admin.IMPORTANT_TIP', 'Important tip'),
  },
};

/**
 * UI element displaying a toggle-able "Tip".
 * The LABEL type will show next to a form field title label
 * The INPUT_GROUP type is designed to be used as an 'input group suffix'.
 */
function Tip(props) {
  const { content, fieldTitle, icon, id, importance } = props;
  const { iconColor, description } = tipImportanceMap[importance];
  const label = i18n.inject(i18n._t('Admin.TIP_LABEL', '{description} for {fieldTitle}'), {
    description,
    fieldTitle
  });
  const classes = ['tip', props.extraClass];
  if (props.type === TIP_TYPES.TITLE) {
    classes.push('tip--title');
  } else if (props.type === TIP_TYPES.INPUT_GROUP) {
    classes.push('tip--input-group', 'btn--last', 'btn-outline-secondary', `text-${iconColor}`);
  }
  const buttonId = `${id}-tip`;
  const buttonProps = {
    id: buttonId,
    onClick: () => {},
    className: classNames(classes),
    noText: true,
    icon
  };

  return (
    <>
      <Button {...buttonProps}>{label}</Button>
      <UncontrolledPopover trigger="legacy" placement="top-end" target={buttonId}>
        <PopoverBody>{content}</PopoverBody>
      </UncontrolledPopover>
    </>
  );
}

/**
 * Core PropType shape for a Tip when used with a form field.
 */
export const tipShape = {
  content: PropTypes.string.isRequired,
  importance: PropTypes.oneOf(Object.values(TIP_IMPORTANCE_LEVELS)),
  type: PropTypes.oneOf(Object.values(TIP_TYPES)),
  icon: PropTypes.string,
};

Tip.propTypes = {
  ...tipShape,
  extraClass: PropTypes.string,
  fieldTitle: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

Tip.defaultProps = {
  importance: TIP_IMPORTANCE_LEVELS.NORMAL,
  icon: 'lamp',
  type: TIP_TYPES.INPUT_GROUP
};

export default Tip;
