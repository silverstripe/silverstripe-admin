import React, { Component } from 'react';
import { Button, Popover, PopoverBody } from 'reactstrap';
import PropTypes from 'prop-types';

export const TIP_IMPORTANCE_LEVELS = {
  NORMAL: 'normal',
  HIGH: 'high',
};

const tipImportanceMap = {
  [TIP_IMPORTANCE_LEVELS.NORMAL]: {
    color: 'muted',
    description: 'Tip',
  },
  [TIP_IMPORTANCE_LEVELS.HIGH]: {
    color: 'danger',
    description: 'Important tip',
  },
};

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

    const tipIconColor = tipImportanceMap[importance].color;
    const tipType = tipImportanceMap[importance].description;

    return [
      (
        <Button
          key={`${id}-tip-button`}
          color="outline-secondary"
          id={`${id}-tip`}
          onClick={this.handleTipToggle}
          className={`btn--no-text btn--last font-icon-${icon} text-${tipIconColor}`}
          aria-label={`${tipType} for ${fieldTitle}`}
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
