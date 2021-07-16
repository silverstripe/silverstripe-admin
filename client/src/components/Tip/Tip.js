import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Popover, PopoverBody } from 'reactstrap';
import i18n from 'i18n';

/**
 * List of values that can be passed in the `importance` prop of the `<Tip />` component.
 * @type {{HIGH: string, NORMAL: string}}
 */
export const TIP_IMPORTANCE_LEVELS = {
  NORMAL: 'normal',
  HIGH: 'high',
};

export const TIP_TYPES = {
  BUTTON: 'button',
  IMAGE: 'image',
};

/**
 * Unique attributes related to each `TIP_IMPORTANCE_LEVEL`.
 */
const tipImportanceMap = {
  [TIP_IMPORTANCE_LEVELS.NORMAL]: {
    iconColor: 'muted',
    type: i18n._t('Admin.NORMAL_TIP', 'Tip'),
  },
  [TIP_IMPORTANCE_LEVELS.HIGH]: {
    iconColor: 'danger',
    type: i18n._t('Admin.IMPORTANT_TIP', 'Important tip'),
  },
};

/**
 * UI element displaying a toggle-able "Tip". Designed to be used as an 'input group suffix'.
 */
class Tip extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };

    this.handleTipToggle = this.handleTipToggle.bind(this);
  }

  handleTipToggle() {
    this.setState((state) => ({ open: !state.open }));
  }

  render() {
    const { content, fieldTitle, icon, id, importance } = this.props;
    const { open } = this.state;

    const { iconColor, type } = tipImportanceMap[importance];

    const label = i18n.inject(i18n._t('Admin.TIP_LABEL', '{type} for {fieldTitle}'), {
      type,
      fieldTitle
    });

    let el;
    let props = {
      key: `${id}-tip-clickable`,
      id: `${id}-tip`,
      onClick: this.handleTipToggle,
      'aria-label': label,
      'aria-expanded': open
    };
    const className = `tip font-icon-${icon} text-${iconColor} ${this.props.extraClass || ''}`.trim();

    if (this.props.type === TIP_TYPES.BUTTON) {
      props = {
        ...props,
        color: 'outline-secondary',
        className: `btn btn-outline-secondary btn--no-text btn--last ${className}`
      };
      el = <Button {...props} />;
    } else if (this.props.type === TIP_TYPES.IMAGE) {
      props = {
        ...props,
        role: 'button',
        tabIndex: 0,
        className
      };
      el = <i {...props} />;
    }

    return [
      el,
      (
        <Popover
          key={`${id}-tip-popover`}
          target={`${id}-tip`}
          placement="top-end"
          isOpen={open}
        >
          <PopoverBody aria-live="assertive" aria-relevant="additions">{content}</PopoverBody>
        </Popover>
      )
    ];
  }
}

/**
 * Core PropType shape for a Tip when used with a form field.
 */
export const tipShape = {
  content: PropTypes.string.isRequired,
  importance: PropTypes.oneOf(Object.values(TIP_IMPORTANCE_LEVELS)),
  icon: PropTypes.string,
};

Tip.propTypes = {
  ...tipShape,
  type: PropTypes.oneOf(Object.values(TIP_TYPES)),
  extraClass: PropTypes.string,
  fieldTitle: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

Tip.defaultProps = {
  importance: TIP_IMPORTANCE_LEVELS.NORMAL,
  icon: 'lamp',
  type: TIP_TYPES.BUTTON
};

export default Tip;
