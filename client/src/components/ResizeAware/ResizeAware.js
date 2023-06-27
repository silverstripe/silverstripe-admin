import { createElement, Component, Children,
  cloneElement, isValidElement } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import PropTypes from 'prop-types';

/**
 * Can be wrapped around a component to detect dimension changes.
 *
 * Adapted from https://github.com/FezVrasta/react-resize-aware created by Federico Zivolo.
 */
class ResizeAware extends Component {
  constructor(props) {
    super(props);

    this.render = this.render.bind(this);
    this.handleResize = this.handleResize.bind(this);

    this.state = { };

    // Initialise Resize Observer
    this.observer = new ResizeObserver(
      entries => entries.forEach(
        ({ contentRect }) => this.handleResize(contentRect)
      )
    );
  }

  componentDidMount() {
    // Wire the container to the Resize Observer
    this.observer.observe(this.container);

    // Trigger an initial sizing event
    const sizes = {
      width: this.container.offsetWidth,
      height: this.container.offsetHeight,
    };
    this.handleResize(sizes);
  }

  componentWillUnmount() {
    this.observer.disconnect();
  }

  /**
   * Handler for the resize events.
   *
   * @note ResizeObserver measure other dimensions aside from height and width,
   * but we don't care about those.
   * @param sizes
   */
  handleResize(sizes) {
    const { width, height } = this.state;
    if (width !== sizes.width || height !== sizes.height) {
      this.setState(sizes);
    }

    if (this.props.onResize) {
      this.props.onResize(sizes);
    }
  }

  /**
   * Render the component
   */
  render() {
    const {
      children,
      onlyEvent,
      component,
      onResize,
      widthPropName,
      heightPropName,
      ...props
    } = this.props;
    const { width, height } = this.state;

    const hasCustomComponent = typeof component !== 'string';

    const widthProp = [widthPropName || 'width'];
    const heightProp = [heightPropName || 'height'];

    const sizes = {
      [widthProp]: width,
      [heightProp]: height,
    };

    return createElement(
      component,
      {
        [hasCustomComponent ? 'getRef' : 'ref']: el => { this.container = el; },
        ...(hasCustomComponent && sizes),
        ...props,
      },
      typeof children === 'function'
        ? children({ width, height })
        : Children.map(
          children,
          child =>
            (isValidElement(child)
              ? cloneElement(child, !onlyEvent ? sizes : null)
              : child)
        )
    );
  }
}

ResizeAware.propTypes = {
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  onResize: PropTypes.func
};

ResizeAware.defaultProps = {
  component: 'div'
};

export default ResizeAware;
