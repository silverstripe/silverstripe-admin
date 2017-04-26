import React, { Component, PropTypes } from 'react';
import i18n from 'i18n';
import classNames from 'classnames';
import TreeDropdownFieldNode from 'components/TreeDropdownField/TreeDropdownFieldNode';

/**
 * Level in a tree dropdown field
 */
class TreeDropdownFieldMenu extends Component {

  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
    this.renderOption = this.renderOption.bind(this);
    this.renderBreadcrumbs = this.renderBreadcrumbs.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  /**
   * Handle clicking "back" on breadcrumbs
   *
   * @param {Event} event
   */
  handleBack(event) {
    event.stopPropagation();
    event.preventDefault();
    if (typeof this.props.onBack === 'function') {
      this.props.onBack(event);
    }
  }

  /**
   * Render breadcrumbs
   *
   * @return {XML}
   */
  renderBreadcrumbs() {
    if (this.props.breadcrumbs.length === 0) {
      return null;
    }

    // Join titles with ' / '
    const breadcrumbs = this.props.breadcrumbs.map((item) => item.title).join(' / ');
    const button = (
        <button className="treedropdownfield__breadcrumbs-button">
          <span className="icon font-icon-level-up" />
        </button>
      );

    return (
      <div className="Select-option treedropdownfield__breadcrumbs flexbox-area-grow fill-width"
        onClick={this.handleBack}
      >
        {button}
        <span className="treedropdownfield__breadcrumbs-crumbs flexbox-area-grow">
          {breadcrumbs}
        </span>
      </div>
    );
  }

  /**
   * Renders a single child node
   *
   * @param {Object} tree - Subtree to render
   * @param {Number} index
   */
  renderOption(tree, index) {
    if (!this.props.renderMenuOptions) {
      return null;
    }
    // Destructure Select.js options
    const {
      focusedOption,
      instancePrefix,
      onFocus,
      onSelect,
      optionClassName,
      optionComponent,
      optionRenderer,
      valueArray,
      onOptionRef,
    } = this.props.renderMenuOptions;

    // mostly copied from defaultMenuRenderer.js
    let Option = optionComponent;
    let isSelected = valueArray.findIndex(
      (nextNode) => (nextNode.id === tree.id)
    ) > -1;
    let isFocused = focusedOption && tree.id === focusedOption.id;
    let optionClass = classNames(optionClassName, {
      treedropdownfield__option: true,
      'Select-option': true,
      'is-selected': isSelected,
      'is-focused': isFocused,
      'is-disabled': tree.disabled,
    });

    return (
      <Option
        className={optionClass}
        instancePrefix={instancePrefix}
        isDisabled={tree.disabled}
        isFocused={isFocused}
        isSelected={isSelected}
        key={`option-${index}-${tree.id}`}
        onFocus={onFocus}
        onSelect={onSelect}
        option={tree}
        optionIndex={index}
        ref={ref => { onOptionRef(ref, isFocused); }}
      >
        {optionRenderer(tree, index)}
      </Option>
    );
  }

  render() {
    if (this.props.loading) {
      return (
        <div className="Select-option flexbox-area-grow fill-width">
          <span className="Select-loading-zone" aria-hidden="true">
            <span className="Select-loading" />
          </span>
          <span className="treedropdownfield__menu-loading flexbox-area-grow">
            {i18n._t('Admin.TREEDROPDOWN_LOADING', 'Loading...')}
          </span>
        </div>
      );
    }
    if (this.props.failed) {
      return (
        <div className="Select-option">
          {i18n._t('Admin.TREEDROPDOWN_FAILED', 'Failed to load')}
        </div>
      );
    }
    if (this.props.tree.count === 0) {
      return (
        <div className="Select-option">
          {i18n._t('Admin.TREEDROPDOWN_NO_CHILDREN', 'No children')}
        </div>
      );
    }

    // Breadcrumbs
    const breadcrumbs = this.renderBreadcrumbs();

    // Render child items in this level
    const children = this.props.tree.children.map(
      (nextChild, i) => this.renderOption(nextChild, i)
    );

    return (
      <div className="treedropdownfield__menu">
        {breadcrumbs}
        {children}
      </div>
    );
  }
}

TreeDropdownFieldMenu.propTypes = {
  className: PropTypes.string,
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape(TreeDropdownFieldNode.propTypes)),
  loading: PropTypes.bool,
  failed: PropTypes.bool,
  tree: PropTypes.shape(TreeDropdownFieldNode.propTypes),
  renderMenuOptions: PropTypes.object,
  onBack: PropTypes.func,
};

export default TreeDropdownFieldMenu;
