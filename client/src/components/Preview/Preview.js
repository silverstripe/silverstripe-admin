import React, { useState, useEffect } from 'react';
import i18n from 'i18n';
import classnames from 'classnames';
import { inject } from 'lib/Injector';
import PropTypes from 'prop-types';
import ActionMenu from '../ActionMenu/ActionMenu';

/**
 * Renders the right-hand collapsable change preview panel
 */
const Preview = ({
  className = 'flexbox-area-grow fill-height',
  itemLinks,
  itemId,
  onBack,
  moreActions,
  ViewModeComponent,
}) => {
  const [frameLoaded, setFrameLoaded] = useState(false);

  let previewUrl = null;
  let previewType = '';
  if (itemLinks && itemLinks.preview) {
    if (itemLinks.preview.Stage) {
      previewUrl = itemLinks.preview.Stage.href;
      previewType = itemLinks.preview.Stage.type;
    } else if (itemLinks.preview.Live) {
      previewUrl = itemLinks.preview.Live.href;
      previewType = itemLinks.preview.Live.type;
    }
  }

  useEffect(() => {
    // Reset frame loaded state when the preview URL changes
    setFrameLoaded(false);
  }, [previewUrl]);

  /**
   * Update state to indicate that the preview page has completed loading
   *
   * @param {boolean} loaded
   */
  const setFrameLoadedState = (loaded = true) => {
    setFrameLoaded(loaded);
  };

  // eslint-disable-next-line no-unused-vars
  const handleBackClick = (event) => {
    if (typeof onBack === 'function') {
      event.preventDefault();
      onBack(event);
    }
  };

  /**
   * Returns list of toolbar buttons
   *
   * @return {Array}
   */
  const buildToolbarButtons = () => {
    const toolbarButtons = [];
    if (itemLinks && itemLinks.edit) {
      const editUrl = itemLinks.edit.href;
      toolbarButtons.push(
        <a key="edit" href={editUrl} className="btn btn-outline-secondary">
          <span className="font-icon-edit btn__icon" aria-hidden="true" />
          <span className="btn__title">{i18n._t('Admin.EDIT', 'Edit')}</span>
        </a>
      );
    }
    return toolbarButtons;
  };

  const renderMoreActions = () => {
    if (!moreActions || moreActions.length === 0) {
      return null;
    }
    return (
      <ActionMenu>
        {moreActions}
      </ActionMenu>
    );
  };

  const renderBody = () => {
    // No item available
    if (!itemId) {
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
      style={{ visibility: frameLoaded ? 'visible' : 'hidden' }}
      className="flexbox-area-grow preview__iframe"
      src={previewUrl}
      onLoad={setFrameLoadedState}
    />);
  };

  const classNameValue = classnames('preview', className);
  return (
    <div className={classNameValue}>
      {renderBody()}
      <div className="toolbar toolbar--south">
        <div className="btn-toolbar">
          {buildToolbarButtons()}
          <ViewModeComponent id="view-mode-toggle-in-preview-nb" area="preview" />
          {renderMoreActions()}
        </div>
      </div>
    </div>
  );
};

Preview.propTypes = {
  className: PropTypes.string,
  itemLinks: PropTypes.object,
  itemId: PropTypes.number,
  onBack: PropTypes.func,
  moreActions: PropTypes.arrayOf(PropTypes.element),
  ViewModeComponent: PropTypes.elementType,
};

export { Preview as Component };

export default inject(
  ['ViewModeToggle'],
  (ViewModeToggle) => ({
    ViewModeComponent: ViewModeToggle
  }),
  () => 'Admin.Preview'
)(Preview);
