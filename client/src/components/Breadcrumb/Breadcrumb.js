import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import FileStatusIcon from 'components/FileStatusIcon/FileStatusIcon';
import Link from 'components/Link/Link';

class Breadcrumb extends Component {
  /**
   * @returns {Object|false}
   */
  getLastCrumb() {
    return this.props.crumbs && this.props.crumbs[this.props.crumbs.length - 1];
  }

  /**
   * @returns {*}
   */
  renderBreadcrumbs() {
    if (!this.props.crumbs) {
      return null;
    }

    return this.props.crumbs.slice(0, -1).map((crumb) => (
      <li key={crumb.text} className="breadcrumb__item">
        <Link
          className="breadcrumb__item-title"
          href={crumb.href}
          onClick={crumb.onClick}
        >
          {crumb.text}
        </Link>
      </li>
    ));
  }

  /**
   * @returns {*}
   */
  renderLastCrumb() {
    const crumb = this.getLastCrumb();
    if (!crumb) {
      return null;
    }
    return (
      <div className="breadcrumb__item breadcrumb__item--last">
        <h2 className="breadcrumb__item-title">
          {crumb.text}
          {crumb.icon && this.renderIcons([crumb.icon])}
          {crumb.icons && this.renderIcons(crumb.icons)}
        </h2>
      </div>
    );
  }

  /**
   * @param {Array} icon
   * @returns {*}
   */
  renderIcons(icons) {
    return icons.map((icon, i) => {
      const { nodeName, className, hasRestrictedAccess, ...other } = icon;
      // reassign with let so linter won't suggest 'const' above for unmodified nodeName/className
      let attrs = { ...other };
      const extraClassName = classNames(['breadcrumb__icon', className]);
      attrs = { tabIndex: '0', ...attrs };
      if (attrs.hasOwnProperty('onClick')) {
        attrs = { role: 'button', ...attrs };
      }
      attrs.key = `breadcrumb-icon-${i}`;
      if (nodeName === 'FileStatusIcon') {
        attrs.fileID = 0;
        attrs.hasRestrictedAccess = hasRestrictedAccess;
        attrs.extraClassName = extraClassName;
        return <FileStatusIcon {...attrs} />;
      }
      attrs.className = extraClassName;
      return <span {...attrs} />;
    });
  }

  /**
   * @returns {*}
   */
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
    // pass in a single icon (retain backwards compatibility)
    icon: PropTypes.shape({
      nodeName: PropTypes.string,
      className: PropTypes.string,
      onClick: PropTypes.func,
      action: (props) => { if (props.action) { throw new Error('action: no longer used'); } },
    }),
    // pass in an array multiple icons (use this going forward)
    icons: PropTypes.arrayOf(PropTypes.shape({
      nodeName: PropTypes.string,
      className: PropTypes.string,
      onClick: PropTypes.func,
    }))
  })),
};

function mapStateToProps(state) {
  return {
    crumbs: state.breadcrumbs,
  };
}

export { Breadcrumb as Component };

export default connect(mapStateToProps)(Breadcrumb);
