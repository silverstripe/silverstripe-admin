/* global window */
import jQuery from 'jquery';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { loadComponent } from 'lib/Injector';

jQuery.entwine('ss', ($) => {
  $('.complex-tree-view__container').entwine({
    ReactRoot: null,
    Component: null,

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

    onrefreshnodes() {
      // Event is now handled via onRefreshNodes callback in React component
    },

    onrefreshparentnode() {
      // Event is now handled via onRefreshParentNode callback in React component
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
      const onRefreshNodes = (callback) => {
        this.on('internalrefresh', (e, nodeId) => {
          if (callback && typeof callback === 'function') {
            callback(nodeId);
          }
        });
      };
      const onRefreshParentNode = (callback) => {
        this.on('internalrefreshparent', (e, parentId) => {
          if (callback && typeof callback === 'function') {
            callback(parentId);
          }
        });
      };
      const onEditItem = schema.data?.onEditItem
        ? schema.data.onEditItem
        : (nodeId) => this.trigger('editnode', [nodeId]);
      const onDuplicateItem = schema.data?.onDuplicateItem
        ? schema.data.onDuplicateItem
        : (nodeId, payload) => {
          if (payload?.includeSubpages) {
            this.trigger('duplicatewithchildrennode', [nodeId]);
          } else {
            this.trigger('duplicatenode', [nodeId]);
          }
        };
      const onAddChild = schema.data?.onAddChild
        ? schema.data.onAddChild
        : (nodeId, payload) => this.trigger('addchildnode', [nodeId, payload?.childType]);
      const onShowAsList = schema.data?.onShowAsList
        ? schema.data.onShowAsList
        : (nodeId) => this.trigger('showaslistnode', [nodeId]);
      const props = {
        ...schema.data,
        ...state,
        contextMenuUrls: Object.keys(contextMenuUrls).length > 0 ? contextMenuUrls : null,
        editUrlPattern: schema.data?.editUrlPattern || null,
        listUrlPattern: schema.data?.listUrlPattern || null,
        labels: schema.data?.labels || null,
        saveNodeEndpoint: schema.data?.saveNodeEndpoint || null,
        updateNodesEndpoint: schema.data?.updateNodesEndpoint || null,
        enableContextMenu: schema.data?.enableContextMenu ?? true,
        enableAddChild: schema.data?.enableAddChild ?? true,
        onEditItem,
        onDuplicateItem,
        onAddChild,
        onShowAsList,
        onRefreshNodes,
        onRefreshParentNode,
      };
      const root = this.getReactRoot();
      if (root) {
        root.render(<Component {...props} />);
      }
    },
  });
});
