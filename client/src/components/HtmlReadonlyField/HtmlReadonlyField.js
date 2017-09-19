import React, { Component } from 'react';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import { FormControl } from 'react-bootstrap-ss';

class HtmlReadonlyField extends Component {
  constructor(props) {
    super(props);

    this.getContent = this.getContent.bind(this);
  }

  /**
   * Sets the content into a dangerouslySetInnerHTML object
   *
   * @returns {object} innerHtml
   */
  getContent() {
    return { __html: this.props.value };
  }

  /**
   * Fetches the properties for the text field
   *
   * @returns {object} properties
   */
  getInputProps() {
    return {
      bsClass: this.props.bsClass,
      componentClass: this.props.componentClass,
      // The extraClass property is defined on both the holder and element
      // for legacy reasons (same behaviour as PHP rendering)
      className: `${this.props.className} ${this.props.extraClass}`,
      id: this.props.id,
      name: this.props.name,
    };
  }

  render() {
    return (
      <FormControl.Static
        {...this.getInputProps()}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={this.getContent()}
      />
    );
  }
}

HtmlReadonlyField.propTypes = {
  id: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
  extraClass: React.PropTypes.string,
  value: React.PropTypes.string,
};

HtmlReadonlyField.defaultProps = {
  // React considers "undefined" as an uncontrolled component.
  extraClass: '',
  className: '',
};

export { HtmlReadonlyField as Component };

export default fieldHolder(HtmlReadonlyField);
