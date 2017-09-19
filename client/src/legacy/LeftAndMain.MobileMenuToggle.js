import $ from 'jquery';
import MobileMenuToggleContainer from 'components/MobileMenuToggle/MobileMenuToggleContainer';
import { closeMobileMenu } from 'state/mobileMenu/MobileMenuActions';
import ReactDOM from 'react-dom';

$.entwine('ss', function($){

  $('.js-react-boot').entwine({

    onmatch: function() {
      const menuToggleWrapper = $('.cms-mobile-menu-toggle-wrapper');
      if (menuToggleWrapper.length > 0) {
        ReactDOM.render(
          <MobileMenuToggleContainer store={window.ss.store} controls="cms-menu" />,
          menuToggleWrapper[0]
        );
      }

      const store = window.ss.store;
      const menu = $('.cms-menu');
      const menuOverlay = $('.cms-menu-mobile-overlay');
      store.subscribe(() => {
        const state = store.getState();
        const isOpen = state.mobileMenu.isOpen;
        menu
          .toggleClass('cms-menu--open', isOpen)
          .attr('aria-expanded', isOpen);
        menuOverlay.attr('aria-expanded', isOpen);
      });
    }
  });

  $('.cms-menu-mobile-overlay').entwine({
    onclick: function() {
      const store = window.ss.store;

      store.dispatch(closeMobileMenu());
    }
  });

});
