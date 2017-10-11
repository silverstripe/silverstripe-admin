/* global document */
import React, { Component, PropTypes } from 'react';

/**
 * Wrapper component that fires a handler (`onClickOut`) when a user clicks
 * outside of the component.
 *
 *
 * Example:
 *
 * ```jsx
 *    class TestComponent extends React.Component {
 *      ...
 *
 *      handleClickOut() {
 *        alert('User clicked outside of TestComponent.');
 *      }
 *
 *      render() {
 *        return (
 *          <Focusedzone onClickOut={this.handleClickOut}>
 *            <div>... </div>
 *          </Focusedzone>
 *        );
 *       }
 *    < /Focusedzone>
 *  ```
 */

class Focusedzone extends Component {
  constructor(props) {
    super(props);

    // This will be set to `true` in `handleElementClick` handler when user
    // clicked inside the component's DOM and reset back to `false` in
    // `handleDocumentClick`. This component knows when user clicked outside of
    // its DOM by checking if `wasClicked` is false in `handleDocumentClick`.
    // All of this works because of the order of event bubbling.
    this.wasClicked = false;

    this.handleElementClick = this.handleElementClick.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
  }

  componentDidMount() {
    const element = this.container;

    // Click event handlers on `el` and `document` will be both
    // triggered when user clicked inside the compoent's DOM. The
    // handler on `el` is triggered before the one on `document` based on event
    // bubbling.
    element.addEventListener('click', this.handleElementClick);
    document.addEventListener('click', this.handleDocumentClick);
  }

  componentWillUnmount() {
    const element = this.container;
    element.removeEventListener('click', this.handleElementClick);
    document.removeEventListener('click', this.handleDocumentClick);
  }

  handleElementClick() {
    this.wasClicked = true;
  }

  handleDocumentClick() {
    if (!this.wasClicked) {
      this.props.onClickOut();
    }
    this.wasClicked = false;
  }

  render() {
    return (
      <div
        className={this.props.className}
        ref={(container) => { this.container = container; }}
      >
        {this.props.children}
      </div>
    );
  }
}

Focusedzone.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  onClickOut: PropTypes.func.isRequired,
};

Focusedzone.defaultProps = {
  className: '',
};

export default Focusedzone;
