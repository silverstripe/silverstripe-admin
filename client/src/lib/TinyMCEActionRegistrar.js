/* global window */

/**
 * Creates a composite identifier for the actions key
 * @param configId
 * @param menu
 * @returns {string}
 */
const createIdentifier = (configId, menu) => (
  configId ? `${configId}.${menu}` : menu
);

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
    const name = createIdentifier(configId, menu);
    const actions = this.getActions(menu, configId, true);

    /* eslint-disable no-param-reassign */
    action.type = 'menuitem';
    // To reduce upgrade pain from tinymce4 to tinymce6 (cms4 to cms5) we've added this
    // as this would mean any custom plugins using this class to register commands won't
    // need to update the syntax for doing so
    if (action.hasOwnProperty('onclick')) {
      action.onAction = action.onclick;
      delete action.onclick;
    }
    /* eslint-enable no-param-reassign */

    // If the action is not already registered either globally or within this config
    if (!actions.find((registeredAction) => action.text === registeredAction.text)) {
      this.actions[name] = [
        ...this.getActions(menu, configId, false),
        { ...action, priority },
      ];
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
  getActions(menu, configId, includingGlobal = true) {
    // Include global actions
    // - if registering a global action ie. without a specific config id
    // - by default or if set to true
    let actions = (!configId || includingGlobal) && this.actions[menu]
      ? this.actions[menu]
      : [];
    const name = createIdentifier(configId, menu);
    if (configId && this.actions[name]) {
      actions = [
        ...actions,
        ...this.actions[name],
      ];
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
  getSortedActions(menu, configId, includingGlobal = true) {
    const actions = this.getActions(menu, configId, includingGlobal);
    return actions.sort((a, b) => {
      // Sort by descending priority
      const priorityDiff = b.priority - a.priority;
      if (priorityDiff) {
        return priorityDiff;
      }
      // If the two priorities are equal, sort by ascending label
      return a.text.toLocaleLowerCase() > b.text.toLocaleLowerCase() ? 1 : -1;
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
