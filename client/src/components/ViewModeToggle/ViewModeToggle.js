import React, { PropTypes, Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import i18n from 'i18n';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { selectEditMode, selectPreviewMode, selectSplitMode } from 'state/viewMode/ViewModeActions';
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
      case 'edit':
        return editIconClass;
      case 'preview':
        return previewIconClass;
      default:
        return splitIconClass;
      }
  }

  getTitle() {
    const { activeState } = this.props;

    switch (activeState) {
      case 'edit':
        return i18n._t('Admin.EDIT_MODE', 'Edit mode');
      case 'preview':
        return i18n._t('Admin.PREVIEW_MODE', 'Preview mode');
      default:
        return i18n._t('Admin.SPLIT_MODE', 'Split mode');
      }
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
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
      splitIconClass,
      {
        'viewmode-toggle__button': true,
        'viewmode-toggle--selected': (activeState === 'split'),
        disabled: (!splitAvailable)
      }
  );

    return (
      <DropdownItem
        type="button"
        disabled={!splitAvailable}
        className={itemClass}
        value="split"
        onClick={this.handleSplitSelect}
        id="splitModeButton"
      >
        {i18n._t('Admin.SPLIT_MODE', 'Split mode')}
      </DropdownItem>
    );
  }

  renderEditDropDownItem() {
    const { activeState, editIconClass } = this.props;

    // Highlight if chosen view mode
    const itemClass = classNames(
      'btn', 'icon-view', 'last', 'viewmode-toggle__button',
      editIconClass,
      { 'viewmode-toggle--selected': (activeState === 'edit') }
    );

    return (
      <DropdownItem
        type="button"
        className={itemClass}
        value="content"
        onClick={this.handleEditSelect}
      >
        {i18n._t('Admin.EDIT_MODE', 'Edit mode')}
      </DropdownItem>
    );
  }

  renderPreviewDropDownItem() {
    const { activeState, previewIconClass } = this.props;

    // Highlight if chosen view mode
    const itemClass = classNames(
      'btn', 'icon-view', 'viewmode-toggle__button',
      previewIconClass,
      { 'viewmode-toggle--selected': (activeState === 'preview') }
    );

    return (
      <DropdownItem
        type="button"
        className={itemClass}
        value="preview"
        onClick={this.handlePreviewSelect}
      >
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
      if (area === 'edit' && activeState === 'split') {
          return null;
      }

      const toggleClassName = classNames(
        this.getIconClass(),
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
  activeState: PropTypes.string,
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
