import React, { PropTypes, Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import FormBuilderModal from 'components/FormBuilderModal/FormBuilderModal';
import fileSchemaModalHandler from 'containers/InsertLinkModal/fileSchemaModalHandler';
import * as schemaActions from 'state/schema/SchemaActions';

class InsertLinkModal extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    if (!props.show) {
      props.setOverrides(null);
    }
  }

  componentWillReceiveProps(props) {
    if ((props.show && !this.props.show) || (!props.show && this.props.show)) {
      props.setOverrides(props.show ? props : null);
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
        onSubmit: this.handleSubmit,
        onHide: this.props.onHide,
        showErrorMessage: true,
      }
    );
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
  setOverrides: PropTypes.func.isRequired,
  actions: PropTypes.object,
  requireLinkText: PropTypes.bool,
  currentPageID: PropTypes.number,
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
  function mapStateToProps(state, ownProps) {
    const sectionConfig = state.config.sections
      .find((section) => section.name === sectionConfigKey);
    const requireTextFieldUrl = ownProps.requireLinkText ? '?requireLinkText' : '';

    // get the schemaUrl to use as a key for overrides
    const schemaUrl = `${sectionConfig.form[formName].schemaUrl}${requireTextFieldUrl}`
      .replace(/:pageid/, ownProps.currentPageID);

    return {
      sectionConfig,
      schemaUrl,
    };
  }

  return compose(
    connect(mapStateToProps, mapDispatchToProps),
    fileSchemaModalHandler
  )(InsertLinkModal);
};

export { InsertLinkModal, createInsertLinkModal };

export default compose(
  connect(() => ({}), mapDispatchToProps),
  fileSchemaModalHandler
)(InsertLinkModal);
