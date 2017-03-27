/**
 * Acts as top level action registrar component for tinymce
 */
class TinyMCEActionRegistrar {

  constructor() {
    this.actions = {};
  }

  /**
   * Register a new action for a menu item
   *
   * @param {String} menu Name of top level menu item
   * @param {Object} action Menu action option
   */
  addAction(menu, action) {
    this.initMenu(menu);
    this.actions[menu].push(action);
  }

  /**
   * Get list of actions for this menu
   *
   * @param {String} menu
   * @return {Array}
   */
  getActions(menu) {
    this.initMenu(menu);
    return this.actions[menu];
  }

  /**
   * Ensure a menu item is registered
   *
   * @param {String} menu name of menu item
   */
  initMenu(menu) {
    if (typeof this.actions[menu] === 'undefined') {
      this.actions[menu] = [];
    }
  }
}

// TODO Fix registration across modules, see lib/Router.js for details
window.ss = window.ss || {};
window.ss.tinymceactions = window.ss.tinymceactions || new TinyMCEActionRegistrar();

export default window.ss.tinymceactions;
