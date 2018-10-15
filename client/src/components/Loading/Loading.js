import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/**
 * Renders a SilverStripe loading animation
 */
class Loading extends PureComponent {
  render() {
    const { containerClass } = this.props;

    return (
      <div className={containerClass}>
        <div key="overlay" className="cms-content-loading-overlay ui-widget-overlay-light" />
        <div key="spinner" className="cms-content-loading-spinner" />
      </div>
    );
  }
}

Loading.propTypes = {
  containerClass: PropTypes.string,
};

Loading.defaultProps = {
  containerClass: 'flexbox-area-grow',
};

export default Loading;
