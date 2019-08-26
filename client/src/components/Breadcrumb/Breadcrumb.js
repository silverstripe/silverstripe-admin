import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


const BackButton = () => {
  const buttonClassNames = [
    'btn',
    'btn-secondary',
    'action',
    'font-icon-left-open-big',
    'breadcrumb__back',
    'btn--no-text',
  ];
  const backButtonProps = {
    className: buttonClassNames.join(' '),
    onClick: console.log,
    href: '#',
    type: 'button',
  };

  return <button {...backButtonProps} />;
};

/**
 * Render a single crumb
 */
const Crumb = ({text, href, onClick}) => (
  <li className="breadcrumb__item">
    <a className="breadcrumb__item-title" href={href} onClick={onClick}>
      {text}
    </a>
  </li>
);

/**
 * Render all the crumbs except the last one
 */
const Crumbs = ({crumbs}) => (
  crumbs.length == 0 ?
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
const CurrentCrumb = ({text, onClick, icon, label}) => (
  <div className="breadcrumb__item breadcrumb__item--last">
    <h2 className="breadcrumb__item-title">
    {text}
    {icon && (
      <span
        className={'breadcrumb__icon ' + (icon.className || '')}
        role="button"
        tabIndex={0}
        aria-label={label}
        onClick={icon.onClick}
      /> )}
    </h2>
  </div>
);

const Breadcrumb = ({crumbs}) => (
  <div class="breadcrumb fill-width">
    { crumbs && crumbs.length > 1 && <BackButton /> }
    <div className="breadcrumb__container fill-height flexbox-area-grow">
      { crumbs && crumbs.length > 0 && <React.Fragment>
        <Crumbs crumbs={[...crumbs].slice(0,-1)} />
        <CurrentCrumb {...([...crumbs].pop())} />
      </React.Fragment> }
    </div>
  </div>
);

Breadcrumb.propTypes = {
  crumbs: PropTypes.arrayOf(PropTypes.shape({
    onClick: PropTypes.func,
    text: PropTypes.string,
    icon: PropTypes.shape({
      className: PropTypes.string,
      label: PropTypes.string,
      onClick: PropTypes.func,
      action: (props) => { if (props.action) { throw new Error('action: no longer used'); } },
    })
  })),
};

function mapStateToProps(state) {
  return {
    crumbs: state.breadcrumbs,
  };
}

export { Breadcrumb as Component };

export default connect(mapStateToProps)(Breadcrumb);
