import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FormBuilderModal from 'components/FormBuilderModal/FormBuilderModal';
import * as schemaActions from 'state/schema/SchemaActions';

const sectionConfigKey = 'SilverStripe\\Admin\\LeftAndMain';
const formName = 'EditorExternalLink';

class InsertLinkExternalModal extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
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
      if (!attrs.Link) {
        delete attrs.Link;
      }

      const overrides = {
        fields: Object.entries(attrs).map((field) => {
          const [name, value] = field;
          return { name, value };
        }),
      };
      console.log(overrides);
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

InsertLinkExternalModal.propTypes = {
  show: PropTypes.bool,
  schemaUrl: PropTypes.string,
  onInsert: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  actions: PropTypes.object,
};

InsertLinkExternalModal.defaultProps = {};

function mapStateToProps(state) {
  const sectionConfig = state.config.sections.find((section) => section.name === sectionConfigKey);

  // get the schemaUrl to use as a key for overrides
  const schemaUrl = `${sectionConfig.form[formName].schemaUrl}`;

  return {
    sectionConfig,
    schemaUrl,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      schema: bindActionCreators(schemaActions, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(InsertLinkExternalModal);
