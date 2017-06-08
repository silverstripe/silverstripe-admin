import $ from 'jQuery';
import MobileMenuToggleContainer from 'components/MobileMenuToggle/MobileMenuToggleContainer';
import ReactDOM from 'react-dom';

$.entwine('ss', function($){

  $('.js-react-boot').entwine({

    onmatch: function() {
      const menuToggleWrapper = $('.cms-mobile-menu-toggle-wrapper');
      if (menuToggleWrapper.length > 0) {
        ReactDOM.render(
          <MobileMenuToggleContainer store={window.ss.store} />,
          menuToggleWrapper[0]
        );
      }
    }
  });


});

