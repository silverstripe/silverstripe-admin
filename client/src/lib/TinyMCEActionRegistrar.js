/* global window */
/**
 * Acts as top level action registrar component for tinymce
 */

class TinyMCEActionRegistrar {
  constructor() {
    this.actions = {};

    this.editorCommandsToUrlTestsMap = {
    };

    this.defaultCommand = 'sslinkexternal';
  }

  /**
   * Register a new action for a menu item, and trigger callback
   *
   * @param {String} menu Name of top level menu item
   * @param {Object} action Menu action option, with custom "priority" property
   * @param {Boolean} configId Identifier of which config this action should be registered to
   * @return {TinyMCEActionRegistrar}
   */
  addAction(menu, action, configId) {
    const priority = action.priority || 50;
    const name = configId ? `${configId}.${menu}` : menu;
    const actions = this.getActions(menu, configId, true);
    // If the action is not already registered either globally or within this config
    if (!actions.some((registeredAction) => action.text === registeredAction.text)) {
      this.actions[name] = this.getActions(menu, configId, false).concat([{ ...action, priority }]);
    }
    return this;
  }

  /**
   * Get list of actions for this menu
   *
   * @param {String} menu
   * @param {String} configId Identifier of which config
   * @param {Boolean} includingGlobal Whether to include global actions
   * not registered to a specific config
   * @return {Array}
   */
  getActions(menu, configId, includingGlobal) {
    // Include global actions
    // - if registering a global action ie. without a specific config id
    // - by default or if set to true
    let actions = (!configId || typeof includingGlobal === 'undefined' || includingGlobal === true) && this.actions[menu]
      ? this.actions[menu]
      : [];
    if (configId && this.actions[`${configId}.${menu}`]) {
      actions = actions.concat(this.actions[`${configId}.${menu}`]);
    }
    return actions;
  }

  /**
   * Get list of actions for this menu, sorted by first by priority and then text
   *
   * @param {String} menu
   * @param {Bool} configId Identifier of which config
   * @param {Boolean} includingGlobal Whether to include global actions
   * not registered to a specific config
   * @return {Array}
   */
  getSortedActions(menu, configId, includingGlobal) {
    const actions = this.getActions(menu, configId, includingGlobal);
    return actions.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority < b.priority;
      }

      return a.text.toLocaleLowerCase() > b.text.toLocaleLowerCase();
    });
  }

  /**
   * Registers a new map item for command name and url test
   *
   * @param {String} command
   * @param {RegExp} test
   * @return {TinyMCEActionRegistrar}
   */
  addCommandWithUrlTest(command, test) {
    this.editorCommandsToUrlTestsMap[command] = test;
    return this;
  }

  setDefaultCommand(command) {
    this.defaultCommand = command;

    return this;
  }

  getDefaultCommand() {
    return this.defaultCommand;
  }

  /**
   * Gets an editor command name based on the given url
   *
   * @param {String} url Inserted url
   * @return {String} Editor command name
   */
  getEditorCommandFromUrl(url) {
    let command = this.getDefaultCommand();

    const commands = Object.keys(this.editorCommandsToUrlTestsMap);
    const matchedCmd = commands.find(cmd =>
      this.editorCommandsToUrlTestsMap[cmd] && this.editorCommandsToUrlTestsMap[cmd].test(url));
    if (matchedCmd) {
      command = matchedCmd;
    }

    return command;
  }
}

// TODO Fix registration across modules, see lib/Router.js for details
window.ss = window.ss || {};
window.ss.tinymceactions = window.ss.tinymceactions || new TinyMCEActionRegistrar();

export default window.ss.tinymceactions;
