import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
 * Renders a dataless field that inserts an header inside a form
 * @returns {JSX.Element}
 */
function HeaderField({ className, extraClass, id, data: { headingLevel, title } }) {
  const Heading = `h${headingLevel || 3}`;
  return (
    <div className="field">
      <Heading className={classnames(className, extraClass)} id={id}>{title}</Heading>
    </div>
  );
}

HeaderField.propTypes = {
  className: PropTypes.string,
  extraClass: PropTypes.string,
  id: PropTypes.string,
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.shape({
      headingLevel: PropTypes.number,
      title: PropTypes.string,
    }),
  ]).isRequired,
};

HeaderField.defaultProps = {
  className: '',
  extraClass: '',
};

export default HeaderField;
