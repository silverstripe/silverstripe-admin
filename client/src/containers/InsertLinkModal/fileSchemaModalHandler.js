import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import * as schemaActions from 'state/schema/SchemaActions';
import { connect } from 'react-redux';

class FileSchemaHandler extends Component {
  constructor(props) {
    super(props);

    this.setOverrides = this.setOverrides.bind(this);
  }

  componentWillMount() {
    this.setOverrides(this.props);
  }

  componentWillUnmount() {
    this.setOverrides();
  }

  /**
   * Compares the current properties with received properties and determines if overrides need to be
   * cleared or added.
   *
   * @param {object} props
   */
  setOverrides(props = null) {
    if (!props) {
      // clear any overrides that may be in place
      const schemaUrl = this.props.schemaUrl;
      if (schemaUrl) {
        this.props.actions.schema.setSchemaStateOverrides(schemaUrl, null);
      }
    } else if (props.schemaUrl) {
      const attrs = Object.assign({}, props.fileAttributes);

      delete attrs.ID;

      const overrides = {
        fields: Object.entries(attrs).map((field) => {
          const [name, value] = field;
          return { name, value };
        }),
      };
      // set overrides into redux store, so that it can be accessed by FormBuilder with the same
      // schemaUrl.
      this.props.actions.schema.setSchemaStateOverrides(props.schemaUrl, overrides);
    }
  }

  render() {
    const TargetComponent = this.props.Component;
    const props = Object.assign({}, this.props);

    delete props.Component;

    return <TargetComponent setOverrides={this.setOverrides} {...props} />;
  }
}

FileSchemaHandler.propTypes = {
  fileAttributes: PropTypes.object,
  Component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  schemaUrl: PropTypes.string,
  actions: PropTypes.object,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      schema: bindActionCreators(schemaActions, dispatch),
    },
  };
}

const ConnectedFileSchemaHandler = connect(() => ({}), mapDispatchToProps())(FileSchemaHandler);

function fileSchemaModalHandler(AssetAdmin) {
  function mapStateToProps() {
    return {
      Component: AssetAdmin,
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(FileSchemaHandler);
}

export { FileSchemaHandler, ConnectedFileSchemaHandler };

export default fileSchemaModalHandler;
