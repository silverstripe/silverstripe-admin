import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class CircularLoading extends PureComponent {
  render() {
    const { className, size, block } = this.props;

    const classNames = classnames('ss-circular-loading-indicator', className, {
      'ss-circular-loading-indicator--block': block,
    });

    return <div style={{ height: size, width: size }} className={classNames} />;
  }
}

CircularLoading.propTypes = {
  className: PropTypes.string,
  block: PropTypes.bool,
  size: PropTypes.string,
};

CircularLoading.defaultProps = {
  block: false,
  size: '6em',
};

export default CircularLoading;
