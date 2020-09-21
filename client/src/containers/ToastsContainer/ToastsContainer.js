import React from 'react';
import Toasts from 'components/Toasts/Toasts';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as toastsActions from 'state/toasts/ToastsActions';

/**
 * Wires the Toasts component into the redux store.
 */
const ToastsContainer = ({ toasts, actions: { dismiss, pause, resume } }) => (
  <Toasts
    toasts={toasts}
    onDismiss={dismiss}
    onPause={pause}
    onResume={resume}
  />
);

const mapStateToProps = ({ toasts: { toasts } }) => ({ toasts });

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(toastsActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ToastsContainer);
