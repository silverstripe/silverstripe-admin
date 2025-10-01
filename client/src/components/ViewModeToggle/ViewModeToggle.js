import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import i18n from 'i18n';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { selectEditMode, selectPreviewMode, selectSplitMode } from 'state/viewMode/ViewModeActions';
import { VIEW_MODE_STATES } from 'state/viewMode/ViewModeStates';
import classNames from 'classnames';

class ViewModeToggle extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };

    this.handleSplitSelect = this.handleSplitSelect.bind(this);
    this.handlePreviewSelect = this.handlePreviewSelect.bind(this);
    this.handleEditSelect = this.handleEditSelect.bind(this);
  }

  getIconClass() {
    const { activeState, editIconClass, previewIconClass, splitIconClass } = this.props;

    switch (activeState) {
      case VIEW_MODE_STATES.EDIT:
        return editIconClass;
      case VIEW_MODE_STATES.PREVIEW:
        return previewIconClass;
      default:
        return splitIconClass;
    }
  }

  getTitle() {
    const { activeState } = this.props;

    switch (activeState) {
      case VIEW_MODE_STATES.EDIT:
        return i18n._t('Admin.EDIT_MODE', 'Edit mode');
      case VIEW_MODE_STATES.PREVIEW:
        return i18n._t('Admin.PREVIEW_MODE', 'Preview mode');
      default:
        return i18n._t('Admin.SPLIT_MODE', 'Split mode');
    }
  }

  toggle() {
    // Force setting state to the end of the execution queue to clear a potential race condition
    // with entwine click handlers
    window.setTimeout(() => this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    })), 0);
  }

  /**
   * Event handler for the split mode button.
   */
  handleSplitSelect() {
    // notify and update the store
    this.props.onSplitSelect();
  }

  /**
   * Event handler for the preview mode button.
   */
  handlePreviewSelect() {
    // notify and update the store
    this.props.onPreviewSelect();
  }

  /**
   * Event handler for the edit mode button.
   */
  handleEditSelect() {
    // notify and update the store
    this.props.onEditSelect();
  }

  renderSplitDropdownItem() {
    const { activeState, splitAvailable, splitIconClass } = this.props;

    const itemClass = classNames(
      'btn', 'icon-view', 'first',
      {
        'viewmode-toggle__button': true,
        'viewmode-toggle--selected': (activeState === VIEW_MODE_STATES.SPLIT),
        disabled: (!splitAvailable)
      }
    );

    return (
      <DropdownItem
        type="button"
        disabled={!splitAvailable}
        className={itemClass}
        value={VIEW_MODE_STATES.SPLIT}
        onClick={this.handleSplitSelect}
        id="splitModeButton"
      >
        <span className={splitIconClass} aria-hidden="true" />
        {i18n._t('Admin.SPLIT_MODE', 'Split mode')}
      </DropdownItem>
    );
  }

  renderEditDropDownItem() {
    const { activeState, editIconClass } = this.props;

    // Highlight if chosen view mode
    const itemClass = classNames(
      'btn', 'icon-view', 'last', 'viewmode-toggle__button',
      { 'viewmode-toggle--selected': (activeState === VIEW_MODE_STATES.EDIT) }
    );

    return (
      <DropdownItem
        type="button"
        className={itemClass}
        value="content"
        onClick={this.handleEditSelect}
      >
        <span className={editIconClass} aria-hidden="true" />
        {i18n._t('Admin.EDIT_MODE', 'Edit mode')}
      </DropdownItem>
    );
  }

  renderPreviewDropDownItem() {
    const { activeState, previewIconClass } = this.props;

    // Highlight if chosen view mode
    const itemClass = classNames(
      'btn', 'icon-view', 'viewmode-toggle__button',
      { 'viewmode-toggle--selected': (activeState === VIEW_MODE_STATES.PREVIEW) }
    );

    return (
      <DropdownItem
        type="button"
        className={itemClass}
        value="preview"
        onClick={this.handlePreviewSelect}
      >
        <span className={previewIconClass} aria-hidden="true" />
        {i18n._t('Admin.PREVIEW_MODE', 'Preview mode')}
      </DropdownItem>
    );
  }

  render() {
    const {
      activeState,
      area,
      splitAvailable,
      dropdownToggleProps,
    } = this.props;

    // Hide button in CMS content area when preview panel is open
    if (area === VIEW_MODE_STATES.EDIT && activeState === VIEW_MODE_STATES.SPLIT) {
      return null;
    }

    const toggleClassName = classNames(
      'btn',
      'viewmode-toggle__dropdown',
      dropdownToggleProps.classname
    );

    return (
      <Dropdown
        isOpen={this.state.dropdownOpen}
        toggle={this.toggle}
        className="viewmode-toggle"
      >
        <DropdownToggle
          className={toggleClassName}
          caret
          {...dropdownToggleProps}
        >
          <span className={this.getIconClass()} aria-hidden="true" />
          <span className="viewmode-toggle__chosen-view-title" >{this.getTitle()}</span>
        </DropdownToggle>
        <DropdownMenu >
          {this.renderSplitDropdownItem()}
          {this.renderEditDropDownItem()}
          {this.renderPreviewDropDownItem()}
          {!splitAvailable &&
          <div className="disabled-tooltip">
            <span className="disabled-tooltip-span">
              {i18n._t('Admin.SCREEN_TOO_SMALL', 'Screen size too small')}
            </span>
          </div>
            }
        </DropdownMenu>
      </Dropdown>
    );
  }
}

ViewModeToggle.propTypes = {
  activeState: PropTypes.oneOf(Object.values(VIEW_MODE_STATES)),
  area: PropTypes.string.isRequired,
  splitAvailable: PropTypes.bool,
  onPreviewSelect: PropTypes.func,
  onEditSelect: PropTypes.func,
  onSplitSelect: PropTypes.func,
  editIconClass: PropTypes.string,
  previewIconClass: PropTypes.string,
  splitIconClass: PropTypes.string,
};

ViewModeToggle.defaultProps = {
  splitAvailable: true,
  editIconClass: 'font-icon-edit-write',
  previewIconClass: 'font-icon-eye',
  splitIconClass: 'font-icon-columns',
  dropdownToggleProps: {},
};

function mapStateToProps(state) {
  return {
    activeState: state.viewMode.activeState,
    splitAvailable: state.viewMode.splitAvailable,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSplitSelect() {
      dispatch(selectSplitMode());
    },
    onEditSelect() {
      dispatch(selectEditMode());
    },
    onPreviewSelect() {
      dispatch(selectPreviewMode());
    },
  };
}

export { ViewModeToggle as Component };
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(ViewModeToggle);
