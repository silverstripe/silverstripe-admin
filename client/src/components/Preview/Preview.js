import React, { Component } from 'react';
import i18n from 'i18n';
import classnames from 'classnames';
import { inject } from 'lib/Injector';
import PropTypes from 'prop-types';
import ActionMenu from '../ActionMenu/ActionMenu';

/**
 * Renders the right-hand collapsable change preview panel
 */
class Preview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      frameLoaded: false,
    };

    this.handleBackClick = this.handleBackClick.bind(this);
    this.setFrameLoaded = this.setFrameLoaded.bind(this);
  }

  componentDidUpdate(prevProps) {
    // Reset frame loaded state when the preview URL changes
    if (!this.state.frameLoaded) {
      return;
    }

    if (prevProps.previewUrl !== this.props.previewUrl) {
      this.setFrameLoaded(false);
    }
  }

  /**
   * Update state to indicate that the preview page has completed loading
   *
   * @param {boolean} loaded
   */
  setFrameLoaded(loaded = true) {
    this.setState({ frameLoaded: loaded });
  }

  handleBackClick(event) {
    if (typeof this.props.onBack === 'function') {
      event.preventDefault();
      this.props.onBack(event);
    }
  }

  /**
   * Returns list of toolbar buttons
   *
   * @return {Array}
   */
  buildToolbarButtons() {
    const toolbarButtons = [];
    if (this.props.itemLinks && this.props.itemLinks.edit) {
      const editUrl = this.props.itemLinks.edit.href;
      toolbarButtons.push(
        <a key="edit" href={editUrl} className="btn btn-outline-secondary">
          <span className="font-icon-edit" aria-hidden="true" />
          <span className="btn__title">{i18n._t('Admin.EDIT', 'Edit')}</span>
        </a>
      );
    }
    return toolbarButtons;
  }

  renderMoreActions() {
    if (!this.props.moreActions || this.props.moreActions.length === 0) {
      return null;
    }
    return (
      <ActionMenu>
        {this.props.moreActions}
      </ActionMenu>
    );
  }

  renderBody() {
    let previewUrl = null;
    let previewType = '';

    // Find preview url
    if (this.props.itemLinks && this.props.itemLinks.preview) {
      if (this.props.itemLinks.preview.Stage) {
        previewUrl = this.props.itemLinks.preview.Stage.href;
        previewType = this.props.itemLinks.preview.Stage.type;
      } else if (this.props.itemLinks.preview.Live) {
        previewUrl = this.props.itemLinks.preview.Live.href;
        previewType = this.props.itemLinks.preview.Live.type;
      }
    }

    // No item available
    if (!this.props.itemId) {
      return (
        <div className="preview__overlay">
          <h3 className="preview__overlay-text">
            {i18n._t('Admin.NO_PREVIEW', 'No preview available.')}
          </h3>
        </div>
      );
    }

    // No preview url
    if (!previewUrl) {
      return (
        <div className="preview__overlay">
          <h3 className="preview__overlay-text">
            {i18n._t('Admin.NO_ITEM_PREVIEW', 'There is no preview available for this item.')}
          </h3>
        </div>
      );
    }

    // Show image preview
    if (previewType && previewType.indexOf('image/') === 0) {
      return (
        <div className="preview__file-container panel--scrollable">
          <img alt={previewUrl} className="preview__file--fits-space" src={previewUrl} />
        </div>
      );
    }

    // Show iframe preview
    return (<iframe
      style={{ visibility: this.state.frameLoaded ? 'visible' : 'hidden' }}
      className="flexbox-area-grow preview__iframe"
      src={previewUrl}
      onLoad={this.setFrameLoaded}
    />);
  }

  render() {
    const { className, ViewModeComponent } = this.props;

    const classNames = classnames('preview', className);
    return (
      <div className={classNames}>
        {this.renderBody()}
        <div className="toolbar toolbar--south">
          <div className="btn-toolbar">
            {this.buildToolbarButtons()}
            <ViewModeComponent id="view-mode-toggle-in-preview-nb" area="preview" />
            {this.renderMoreActions()}
          </div>
        </div>
      </div>
    );
  }
}

Preview.propTypes = {
  className: PropTypes.string,
  itemLinks: PropTypes.object,
  itemId: PropTypes.number,
  onBack: PropTypes.func,
  moreActions: PropTypes.arrayOf(PropTypes.element),
  ViewModeComponent: PropTypes.elementType,
};

Preview.defaultProps = {
  className: 'flexbox-area-grow fill-height',
};

export { Preview as Component };

export default inject(
  ['ViewModeToggle'],
  (ViewModeToggle) => ({
    ViewModeComponent: ViewModeToggle
  }),
  () => 'Admin.Preview'
)(Preview);
