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

    return [
      (
        <Button
          key={`${id}-tip-button`}
          color="outline-secondary"
          id={`${id}-tip`}
          onClick={this.handleTipToggle}
          className={`btn--no-text btn--last font-icon-${icon} text-${iconColor}`}
          aria-label={label}
          aria-expanded={open}
        />
      ),
      (
        <Popover
          key={`${id}-tip-popover`}
          target={`${id}-tip`}
          placement="top-end"
          isOpen={this.state.open}
        >
          <PopoverBody aria-live="assertive" aria-relevant="additions">{content}</PopoverBody>
        </Popover>
      )
    ];
  }
}

export const tipShape = {
  content: PropTypes.string.isRequired,
  importance: PropTypes.oneOf(Object.values(TIP_IMPORTANCE_LEVELS)),
  icon: PropTypes.string,
};

Tip.propTypes = {
  ...tipShape,
  fieldTitle: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

Tip.defaultProps = {
  importance: TIP_IMPORTANCE_LEVELS.NORMAL,
  icon: 'lamp',
};

export default Tip;
