import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

/**
 * Get the an element from the end of the array
 * @param {array} list
 * @param {number} idx
 * @returns {Object}
 */
const fromEnd = (list, idx) => list[list.length - 1 - idx];

const suppressClick = (onClick) => ((event) => {
  if (typeof onClick === 'function') {
    event.preventDefault();
    onClick(event);
  }
});

/**
 * Render a back button that trigers the action of the second to last crumb
 */
const BackButton = ({ onClick, ...props }) => {
  const backButtonProps = {
    className: classNames(
      'btn',
      'btn-secondary',
      'action',
      'font-icon-left-open-big',
      'breadcrumb__back',
      'btn--no-text',
    ),
    onClick: suppressClick(onClick),
    ...props
  };

  return <a {...backButtonProps} />;
};

/**
 * Render an indivdual crumb
 */
const Crumb = ({ text, href, onClick }) => (
  <li className="breadcrumb__item">
    <a className="breadcrumb__item-title" href={href} onClick={suppressClick(onClick)}>
      {text}
    </a>
  </li>
);

/**
 * Render all the crumbs except the last one
 */
const Crumbs = ({ crumbs }) => (
  crumbs.length === 0 ?
    null :
    <div className="breadcrumb__list-container">
      <ol className="breadcrumb">
        {crumbs.map((crumb, idx) => <Crumb key={crumb.text + idx} {...crumb} />)}
      </ol>
    </div>
);

/**
 * Render the primary crumb
 */
const CurrentCrumb = ({ text, icon, label }) => (
  <div className="breadcrumb__item breadcrumb__item--last">
    <h2 className="breadcrumb__item-title">
      {text}
      {icon &&
      <span
        className={classNames('breadcrumb__icon', icon.className)}
        role="button"
        tabIndex={0}
        aria-label={label}
        onClick={icon.onClick}
      />}
    </h2>
  </div>
);

const Breadcrumb = ({ crumbs, showBackButton }) => (
  <div className="breadcrumb fill-width">
    { showBackButton && crumbs && crumbs.length > 1 && <BackButton {...fromEnd(crumbs, 1)} /> }
    <div className="breadcrumb__container fill-height flexbox-area-grow">
      { crumbs && crumbs.length > 0 && <React.Fragment>
        <Crumbs crumbs={[...crumbs].slice(0, -1)} />
        <CurrentCrumb {...fromEnd(crumbs, 0)} />
      </React.Fragment> }
    </div>
  </div>
);

Breadcrumb.propTypes = {
  crumbs: PropTypes.arrayOf(PropTypes.shape({
    onClick: PropTypes.func,
    href: PropTypes.string,
    text: PropTypes.string,
    icon: PropTypes.shape({
      className: PropTypes.string,
      label: PropTypes.string,
      onClick: PropTypes.func,
      action: (props) => { if (props.action) { throw new Error('action: no longer used'); } },
    })
  })),
  showBackButton: PropTypes.bool
};

Breadcrumb.defaultProps = {
  showBackButton: true
};

function mapStateToProps(state) {
  return {
    crumbs: state.breadcrumbs,
  };
}

export { Breadcrumb as Component };

export default connect(mapStateToProps)(Breadcrumb);
