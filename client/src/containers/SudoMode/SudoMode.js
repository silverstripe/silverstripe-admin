import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Config from 'lib/Config';
import i18n from 'i18n';
import SudoModePasswordField from '../../components/SudoModePasswordField/SudoModePasswordField';

// See SudoModeController::getClientConfig()
const configSectionKey = 'SilverStripe\\Admin\\SudoModeController';

/**
 * Provides a HOC wrapper that will enforce "sudo mode".
 *
 * This checks that the user has verified that they are them via password
 * entry within a certain period of time since they originally logged in.
 * If this state is not active then they will be presented with a notice,
 * then a verification form, then the passed through component will be
 * rendered as normal.
 *
 * Note that any backend controllers that accept XHR requests from wrapped
 * components should enforce backend sudo mode checks, while they can
 * assume that sudo mode would be active before requests are actually made
 * to them via legitimate use paths.
 */
const withSudoMode = (WrappedComponent) => {
  class ComponentWithSudoMode extends Component {
    constructor(props) {
      super(props);

      this.state = {
        active: Config.getSection(configSectionKey).sudoModeActive || false,
      };
    }

    /**
     * Returns whether "sudo mode" is active for the current user.
     *
     * @returns {boolean}
     */
    isSudoModeActive() {
      return this.state.active === true;
    }

    render() {
      if (!this.isSudoModeActive()) {
        return <SudoModePasswordField
          verifyMessage={i18n._t('Admin.VERIFY_ITS_YOU', 'Verify it\'s you first.')}
          onSuccess={() => this.setState({ active: true })}
          autocomplete="off"
        />; // this.renderSudoMode();
      }
      return <WrappedComponent {...this.props} />;
    }
  }

  ComponentWithSudoMode.propTypes = {
    LoadingComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  };

  return ComponentWithSudoMode;
};

export default withSudoMode;
