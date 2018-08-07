import React, {PropTypes, Component} from 'react';
import TagList from './TagList';
import SummaryTag from './SummaryTag';
import ResizeAware from 'react-resize-aware';
import classnames from 'classnames';
import i18n from 'i18n';
import ReactDOM from "react-dom";


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

  componentDidUpdate(prevProps, prevState) {
    const placeholderWidth = this.getPlaceholderSize();
    this.refreshShowSummaryView(placeholderWidth);
  }

  /**
   * Detect resizing of the TagList placholder and compare it to the max width our component can occupy.
   * If it's bigger, the summary view is triggered.
   * @param tagListDimension
   */
  onResize(tagListDimension) {
    this.refreshShowSummaryView(tagListDimension.width);
  }

  refreshShowSummaryView(placeholderWidth) {
    const maxWidth = this.props.maxSize;
    const showSummaryView = maxWidth < placeholderWidth;

    if (this.state.showSummaryView !== showSummaryView) {
      this.setState(() => ({showSummaryView}));
    }
  }

  /**
   * Measure the width of the root node. This will tell us what the maximum size our tag list can be.
   * @todo remove.
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

  render() {

    const {maxSize, ...listProps} = this.props;
    const showSummaryView = this.state.showSummaryView;
    const count = this.props.tags.length;
    const classes = classnames(
      'compact-tag-list',
      {'compact-tag-list__show-summary-view': showSummaryView}
    );

    return (
      <div className="compact-tag-list" style={{'maxWidth': `${maxSize}px`}}>
        <ResizeAware onResize={this.onResize} className="compact-tag-list__placeholder" aria-hidden={true}>
          <TagList {...listProps} focusable={false} />
        </ResizeAware>
        { showSummaryView ?
          <SummaryTag count={count} /> :
          <TagList {...listProps} />
        }
      </div>
    );
  }

}

CompactTagList.propTypes = Object.assign({}, TagList.propTypes, {
  maxSize: PropTypes.number.required
});


export default CompactTagList;
