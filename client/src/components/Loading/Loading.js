import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';

/**
 * Renders a Silverstripe loading animation styled after the Silverstripe logo
 *
 * `spinner__animation__outline_right` and `spinner__animation__outline_left`
 * They form the two halves of the logo. They are transparent and are used
 * as masks to clip the things that are animated.
 *
 * spinner__animation__fill-left and spinner__animation__fill-right
 * Those are two plain lines with heavy strokes. The lines mostly follow the
 * middle of the two shapes. The strokes are dashed with a dash length long
 * enough to cover the full length of the two paths. SVG allow you to control
 * the dash offset. That's what's actually animated to create the illusion
 * that the paths are being "drawn".
 */
function Loading({ containerClass }) {
  // If we are displaying many loading indicators at the same time, we need to
  const [id] = useState(uuid());

  return (
    <div className={containerClass}>
      <div key="overlay" className="cms-content-loading-overlay ui-widget-overlay-light" />
      <div key="spinner" className="cms-content-loading-spinner">
        <div className="spinner">
          <svg
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width="512"
            height="297"
            viewBox="0 0 512 297"
            className="spinner__animation"
          >
            <defs>
              <path
                id={`spinner__animation__outline_right_${id}`}
                d="M253 29L145 105C130 115 126 136 137 150C147 165 168 169 183
                159L291 83C335 52 397 63 428 107C459 152 448 214 404 245L370
                268C398 316 461 296 490 245C520 191 519 123 482 70C430 -4 327
                -22 253 29Z"
              />
              <path
                id={`spinner__animation__outline_left_${id}`}
                d="M258 266L366 191C381 180 385 160 374 145C364 130 343 127 328
                137L220 212C176 244 114 233 83 188C52 144 63 82 107 51L141 27C113
                -20 50 -0 21 51C-8 104 -7 172 29 226C81 300 184 318 258 266V266Z"
              />
              <clipPath id={`spinner__animation__mask_right_${id}`}>
                <use href={`#spinner__animation__outline_right_${id}`} />
              </clipPath>
              <clipPath id={`spinner__animation__mask_left_${id}`}>
                <use href={`#spinner__animation__outline_left_${id}`} />
              </clipPath>
            </defs>
            <use
              className="spinner__animation__empty"
              href={`#spinner__animation__outline_left_${id}`}
            />
            <use
              className="spinner__animation__empty"
              href={`#spinner__animation__outline_right_${id}`}
            />
            <path
              d="M 379,145 236,242 C 179,282 102,273 62,216 22,159 19,77 76,37 L 135,7"
              className="spinner__animation__fill-left"
              clipPath={`url(#spinner__animation__mask_left_${id})`}
            />
            <path
              d="M 138,148 281,50 c 57,-39 129,-30 169,26 39,56 41,136 -14,178 l -47,40"
              className="spinner__animation__fill-right"
              clipPath={`url(#spinner__animation__mask_right_${id})`}
            />
            <path
              d="M253 29L145 105C130 115 126 136 137 150C147 165 168 169 183
              159L291 83C335 52 397 63 428 107C459 152 448 214 404 245L370
              268C398 316 461 296 490 245C520 191 519 123 482 70C430 -4 327
              -22 253 29Z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

Loading.propTypes = {
  containerClass: PropTypes.string,
};

Loading.defaultProps = {
  containerClass: 'flexbox-area-grow',
};

export default Loading;
