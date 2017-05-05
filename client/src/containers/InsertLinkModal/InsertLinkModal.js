import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FormBuilderModal from 'components/FormBuilderModal/FormBuilderModal';
import * as schemaActions from 'state/schema/SchemaActions';

class InsertLinkModal extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.setOverrides(props.show ? props : null);
  }

  componentWillReceiveProps(props) {
    if (props.show && !this.props.show || !props.show && this.props.show) {
      this.setOverrides(props.show ? props : null);
    }
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
      const schemaUrl = props && props.schemaUrl || this.props.schemaUrl;
      if (schemaUrl) {
        this.props.actions.schema.setSchemaStateOverrides(schemaUrl, null);
      }
    }
    if (props && props.schemaUrl) {
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

  /**
   * Generates the properties for the modal
   * @returns {object}
   */
  getModalProps() {
    const props = Object.assign(
      {},
      this.props,
      {
        handleSubmit: this.handleSubmit,
        handleHide: this.props.onHide,
      }
    );
    delete props.onHide;
    delete props.onInsert;
    delete props.sectionConfig;

    return props;
  }

  handleSubmit(data, action) {
    switch (action) {
      case 'action_cancel': {
        this.props.onHide();
        break;
      }
      default: {
        this.props.onInsert(data, action);
      }
    }

    return Promise.resolve();
  }

  render() {
    const modalProps = this.getModalProps();
    return <FormBuilderModal {...modalProps} />;
  }
}

InsertLinkModal.propTypes = {
  show: PropTypes.bool,
  schemaUrl: PropTypes.string,
  onInsert: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  actions: PropTypes.object,
};

InsertLinkModal.defaultProps = {};

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      schema: bindActionCreators(schemaActions, dispatch),
    },
  };
}

const createInsertLinkModal = (sectionConfigKey, formName) => {
  function mapStateToProps(state) {
    const sectionConfig = state.config.sections
      .find((section) => section.name === sectionConfigKey);

    // get the schemaUrl to use as a key for overrides
    const schemaUrl = `${sectionConfig.form[formName].schemaUrl}`;

    return {
      sectionConfig,
      schemaUrl,
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(InsertLinkModal);
};

export { InsertLinkModal, createInsertLinkModal };

export default connect(() => ({}), mapDispatchToProps)(InsertLinkModal);
