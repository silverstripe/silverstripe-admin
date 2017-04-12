import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

class InsertLinkExternalModal extends Component {
  render() {
    return <div>hello!</div>;
  }
}

InsertLinkExternalModal.propTypes = {

};

InsertLinkExternalModal.defaultProps = {

};

function mapStateToProps(state, ownProps) {
  const sectionConfig = state.config.sections[sectionConfigKey];

  // get the schemaUrl to use as a key for overrides
  const fileId = ownProps.fileAttributes ? ownProps.fileAttributes.ID : null;
  const schemaUrl = fileId && `${sectionConfig.form.fileInsertForm.schemaUrl}/${fileId}`;

  return {
    sectionConfig,
    schemaUrl,
  };
}

export default connect(mapStateToProps)(InsertLinkExternalModal);
