import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class Breadcrumb extends Component {
  getLastCrumb() {
    return this.props.crumbs && this.props.crumbs[this.props.crumbs.length - 1];
  }

  renderBreadcrumbs() {
    if (!this.props.crumbs) {
      return null;
    }

    return this.props.crumbs.slice(0, -1).map((crumb) => (
      <li key={crumb.text} className="breadcrumb__item">
        <a
          className="breadcrumb__item-title"
          href={crumb.href}
          onClick={crumb.onClick}
        >
          {crumb.text}
        </a>
      </li>
    ));
  }

  renderLastCrumb() {
    const crumb = this.getLastCrumb();
    if (!crumb) {
      return null;
    }

    const iconClassNames = ['breadcrumb__icon'];
    if (crumb.icon) {
      iconClassNames.push(crumb.icon.className);
    }

    return (
      <div className="breadcrumb__item breadcrumb__item--last">
        <h2 className="breadcrumb__item-title">
          {crumb.text}
          {crumb.icon && (
            <span
              className={iconClassNames.join(' ')}
              role="button"
              tabIndex={0}
              onClick={crumb.icon.onClick}
            />
          )}
        </h2>
      </div>
    );
  }

  render() {
    return (
      <div className="breadcrumb__container fill-height flexbox-area-grow">
        { this.props.crumbs && this.props.crumbs.length > 1 &&
          <div className="breadcrumb__list-container">
            <ol className="breadcrumb">
              {this.renderBreadcrumbs()}
            </ol>
          </div>
        }
        {this.renderLastCrumb()}
      </div>
    );
  }
}

Breadcrumb.propTypes = {
  crumbs: PropTypes.arrayOf(PropTypes.shape({
    onClick: PropTypes.func,
    text: PropTypes.string,
    icon: PropTypes.shape({
      className: PropTypes.string,
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
