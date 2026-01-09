/* global window */
import jQuery from 'jquery';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { loadComponent } from 'lib/Injector';

jQuery.entwine('ss', ($) => {
  $('.complex-tree-view__container').entwine({
    ReactRoot: null,
    Component: null,Updaetd

    onmatch() {
      this._super();
      let root = this.getReactRoot();
      if (!root) {
        root = createRoot(this[0]);
        this.setReactRoot(root);
      }
      this.renderComponent();
    },

    onunmatch() {
      this._super();
      const root = this.getReactRoot();
      if (root) {
        root.unmount();
        this.setReactRoot(null);
      }
    },

    renderComponent() {
      let Component = this.getComponent();
      if (!Component) {
        Component = loadComponent('ComplexTreeView');
        this.setComponent(Component);
      }
      const schema = this.data('schema') || {};
      const state = this.data('state') || {};
      const contextMenuUrls = {};
      if (schema.data?.duplicateEndpoint) {
        contextMenuUrls.duplicate = schema.data.duplicateEndpoint;
      }
      if (schema.data?.duplicateWithChildrenEndpoint) {
        contextMenuUrls.duplicateWithChildren = schema.data.duplicateWithChildrenEndpoint;
      }
      if (schema.data?.addChildEndpoint) {
        contextMenuUrls.addChild = schema.data.addChildEndpoint;
      }
      const props = {
        ...schema.data,
        ...state,
        contextMenuUrls: Object.keys(contextMenuUrls).length > 0 ? contextMenuUrls : null,
      };
      const root = this.getReactRoot();
      if (root) {
        root.render(<Component {...props} />);
      }
    },
  });
});
