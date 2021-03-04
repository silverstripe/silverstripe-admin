import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const CmsSiteName = ({ title, baseHref }) => (
  <div className="cms-sitename">
    <a href="#" className="cms-sitename__link font-icon-silverstripe font-icon-large" target="_blank">
    </a>
    <a className="cms-sitename__title" href={baseHref} target="_blank">{title}</a>
  </div>
);

CmsSiteName.propTypes = {
  title: PropTypes.string,
  baseHref: PropTypes.string,
};

CmsSiteName.defaultProps = {
};

export default CmsSiteName;
