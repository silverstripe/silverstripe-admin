import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import FormBuilderModal from 'components/FormBuilderModal/FormBuilderModal';
import fileSchemaModalHandler from 'containers/InsertLinkModal/fileSchemaModalHandler';
import * as schemaActions from 'state/schema/SchemaActions';

class InsertLinkModal extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    if (!props.isOpen) {
      props.setOverrides(null);
    }
  }

  componentDidUpdate(oldProps) {
    const props = this.props;
    if ((props.isOpen && !oldProps.isOpen) || (!props.isOpen && oldProps.isOpen)) {
      props.setOverrides(props.isOpen ? props : null);
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
        onClosed: this.props.onClosed,
        autoFocus: true,
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
        this.props.onClosed();
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
  isOpen: PropTypes.bool,
  schemaUrl: PropTypes.string,
  onInsert: PropTypes.func.isRequired,
  onClosed: PropTypes.func.isRequired,
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
      .replace(/:pageid/, ownProps.currentPageID || 0);

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
