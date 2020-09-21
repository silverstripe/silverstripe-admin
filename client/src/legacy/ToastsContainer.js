/* global window */
import jQuery from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import Injector, { loadComponent } from 'lib/Injector';
import { display } from 'state/toasts/ToastsActions';

const ToastsContainer = loadComponent('ToastsContainer');

/**
 * Initialised the toast container
 */
jQuery.entwine('ss', ($) => {
  $('body').entwine({
    onmatch() {
      const container = $('<div class="toasts-container"></div>');
      this.append(container);
      ReactDOM.render(<ToastsContainer />, container[0]);
    },
  });
});

/**
 * Add a jQuery notice polyfill that hooks into our reactstrap toast API.
 *
 * This allows Entwine contexts to call jQuery.noticeAdd() to display toast notifications.
 */
((jquery) => {
  jquery.extend({
    noticeAdd(options) {
      // Manually dispatch a redux display event
      const { dispatch } = Injector.reducer.store;
      dispatch(display(options));
    }
  });
})(jQuery);
