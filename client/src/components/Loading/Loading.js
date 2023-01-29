/* global window */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/**
 * Renders a Silverstripe loading animation styled after the Silverstripe logo
 */
class Loading extends PureComponent {
  render() {
    const { containerClass } = this.props;

    return (
      <div className={containerClass}>
        <div key="overlay" className="cms-content-loading-overlay ui-widget-overlay-light" />
        <div key="spinner" className="cms-content-loading-spinner">
          <div className="spinner">
            {/* window.location is neccessary for Safari which otherwise prepends the base tag */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 30 30"
              width="30"
              height="30"
              className="spinner__animation"
            >
              <g>
                <defs>
                  <path
                    id="spinner__animation__outline"
                    d="M17.6,9.8c-2.3,1.7-2.8,5-1.1,7.3l4.2-3.1
                    c1.1-0.8,2.7-0.6,3.6,0.5c0.8,1.1,0.6,2.7-0.5,3.6l-6.2,4.6
                    c-2.3,1.7-2.8,5-1.1,7.3l10.4-7.7c3.4-2.6,4.1-7.4,1.6-10.8
                    C25.9,8,21.1,7.3,17.6,9.8z M13.4,12.9L9.3,16c-1.1,0.8-2.7,0.6-3.6-0.5
                    s-0.6-2.7,0.5-3.6l6.2-4.6c2.3-1.7,2.8-5,1.1-7.3L3.1,7.7
                    c-3.4,2.6-4.1,7.4-1.6,10.8c2.6,3.4,7.4,4.1,10.8,1.6
                    C14.7,18.4,15.1,15.2,13.4,12.9z"
                  />
                  <clipPath id="spinner__animation__mask">
                    <use xlinkHref={`${window.location}#spinner__animation__outline`} />
                  </clipPath>
                </defs>
                <use
                  className="spinner__animation__empty"
                  xlinkHref={`${window.location}#spinner__animation__outline`}
                />
                <path
                  className="spinner__animation__fill"
                  clipPath={`url(${window.location}#spinner__animation__mask)`}
                  d="M15,2.1L4.7,9.8c-2.3,1.7-2.8,4.9-1.1,7.2
                  s4.9,2.8,7.2,1.1l8.3-6.1c2.3-1.7,5.5-1.2,7.2,1.1
                  s1.2,5.5-1.1,7.2L15,27.9"
                />
              </g>
            </svg>
          </div>
        </div>
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
