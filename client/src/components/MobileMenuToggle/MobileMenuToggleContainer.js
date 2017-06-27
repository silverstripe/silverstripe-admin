import { toggleMobileMenu } from 'state/mobileMenu/MobileMenuActions';
import { connect } from 'react-redux';
import MobileMenuToggle from './MobileMenuToggle';

export default connect(
  state => ({
    isOpen: state.mobileMenu.isOpen,
  }),
  dispatch => ({
    onClick() {
      dispatch(toggleMobileMenu());
    },
  })
)(MobileMenuToggle);
