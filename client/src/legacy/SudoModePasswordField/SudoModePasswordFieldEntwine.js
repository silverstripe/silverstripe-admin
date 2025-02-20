/* global window */
import jQuery from 'jquery';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { loadComponent } from 'lib/Injector';

jQuery.entwine('ss', ($) => {
  // `.SudoModePasswordField` will match both the field holder and the field
  // we only want to run this on the field holder, hence the `:not(:input)`
  $('.js-injector-boot .SudoModePasswordField:not(:input)').entwine({
    ReactRoot: null,

    onmatch() {
      this._super();
      const cmsContentID = this.closest('.cms-content').attr('id');
      const context = (cmsContentID)
        ? { context: cmsContentID }
        : {};

      const SudoModePasswordField = loadComponent('SudoModePasswordField', context);
      const input = this.find('input.SudoModePasswordField')[0];
      const props = {
        autocomplete: input.getAttribute('autocomplete'),
        onSuccess: () => this.reloadPage(),
      };

      let root = this.getReactRoot();
      if (!root) {
        root = createRoot(this[0]);
      }

      root.render(<SudoModePasswordField {...props}/>);
      this.setReactRoot(root);
    },

    onunmatch() {
      this._super();
      const root = this.getReactRoot();
      if (root) {
        root.unmount();
        this.setReactRoot(null);
      }
    },

    /**
     * This is used by the react component to reload the page after sudo mode is activated.
     * This is here instead of inside the react component because in a pure react form the success handler
     * should result in re-rendering the react form with editable fields, instead of reloading the whole page.
     */
    reloadPage() {
      this.closest('.cms-container').reloadCurrentPanel();
    },
  });
});
