import React, { Component } from 'react';
import TagList from 'components/Tag/TagList';
import ResizeAware from 'components/ResizeAware/ResizeAware';
import classnames from 'classnames';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import SummaryTag from './SummaryTag';

/**
 * Extension of TagList that is aware of its size and switch to a summary view if greater than a
 * specific width.
 */
class CompactTagList extends Component {
  constructor(props) {
    super(props);

    this.render = this.render.bind(this);
    this.onResize = this.onResize.bind(this);
    this.refreshShowSummaryView = this.refreshShowSummaryView.bind(this);
    this.getPlaceholderSize = this.getPlaceholderSize.bind(this);

    this.state = {
      showSummaryView: false
    };
  }

  componentDidUpdate() {
    const placeholderWidth = this.getPlaceholderSize();
    this.refreshShowSummaryView(placeholderWidth);
  }

  /**
   * Detect resizing of the TagList placeholder and compare it to the max width our component can
   * occupy. If it's bigger, the summary view is triggered.
   * @param tagListDimension
   */
  onResize(tagListDimension) {
    this.refreshShowSummaryView(tagListDimension.width);
  }

  /**
   * Measure the width of the root node. This will tell us what the maximum size our tag list can
   * be.
   * @returns {number}
   */
  getPlaceholderSize() {
    const node = ReactDOM.findDOMNode(this);
    if (!node) {
      return 0;
    }

    const placeholder = node.querySelector('.compact-tag-list__placeholder');

    if (placeholder) {
      return placeholder.getBoundingClientRect().width;
    }

    return 0;
  }

  /**
   * Compare placeholderWidth to the max width and decide if we should the showSummaryView state.
   * @param placeholderWidth
   */
  refreshShowSummaryView(placeholderWidth) {
    const maxWidth = this.props.maxSize;
    const showSummaryView = maxWidth < placeholderWidth;

    if (this.state.showSummaryView !== showSummaryView) {
      this.setState(() => ({ showSummaryView }));
    }
  }

  render() {
    const { maxSize, onSummary, ...listProps } = this.props;
    const showSummaryView = this.state.showSummaryView;
    const count = this.props.tags.length;
    const classes = classnames(
      'compact-tag-list',
      { 'compact-tag-list__show-summary-view': showSummaryView }
    );

    return (
      <div className={classes}>
        <ResizeAware onResize={this.onResize} className="compact-tag-list__placeholder" aria-hidden>
          <TagList {...listProps} focusable={false} />
        </ResizeAware>
        <div className="compact-tag-list__visible">
          { showSummaryView ?
            <SummaryTag count={count} onClick={onSummary} onNext={listProps.onHolderFocus} /> :
            <TagList {...listProps} />
        }
        </div>
      </div>
    );
  }
}

CompactTagList.propTypes = Object.assign({}, TagList.propTypes, {
  maxSize: PropTypes.number,
  onSummary: PropTypes.func
});

CompactTagList.defaultProps = {
  maxSize: 0,
  onSummary: () => {}
};

export default CompactTagList;
