import $ from 'jquery';
import MobileMenuToggleContainer from 'components/MobileMenuToggle/MobileMenuToggleContainer';
import { closeMobileMenu } from 'state/mobileMenu/MobileMenuActions';
import { createRoot } from 'react-dom/client';

$.entwine('ss', function($){

  $('.js-react-boot').entwine({

    onmatch: function() {
      const menuToggleWrapper = $('.cms-mobile-menu-toggle-wrapper');
      if (menuToggleWrapper.length > 0) {
          const root = createRoot(menuToggleWrapper[0]);
          root.render(<MobileMenuToggleContainer store={window.ss.store} controls="cms-menu" />);
      }

      const store = window.ss.store;
      const menu = $('.cms-menu');
      const menuOverlay = $('.cms-menu-mobile-overlay');
      store.subscribe(() => {
        const state = store.getState();
        const isOpen = state.mobileMenu.isOpen;
        menu
          .toggleClass('cms-menu--open', isOpen);
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
