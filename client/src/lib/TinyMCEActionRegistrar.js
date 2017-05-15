/**
 * Acts as top level action registrar component for tinymce
 */

class TinyMCEActionRegistrar {

  constructor() {
    this.actions = {};
  }

  /**
   * Register a new action for a menu item, and trigger callback
   *
   * @param {String} menu Name of top level menu item
   * @param {Object} action Menu action option
   */
  addAction(menu, action) {
    this.actions[menu] = this.getActions(menu).concat([action]);
  }

  /**
   * Get list of actions for this menu
   *
   * @param {String} menu
   * @return {Array}
   */
  getActions(menu) {
    return this.actions[menu] || [];
  }
}

// TODO Fix registration across modules, see lib/Router.js for details
window.ss = window.ss || {};
window.ss.tinymceactions = window.ss.tinymceactions || new TinyMCEActionRegistrar();

export default window.ss.tinymceactions;
