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
   * @return {TinyMCEActionRegistrar}
   */
  addAction(menu, action) {
    const priority = action.priority || 50;
    this.actions[menu] = this.getActions(menu).concat([{ ...action, priority }]);
    return this;
  }

  /**
   * Get list of actions for this menu, sorted by first by priority and then text
   *
   * @param {String} menu
   * @return {Array}
   */
  getActions(menu) {
    return this.actions[menu] || [];
  }

  getSortedActions(menu) {
    const actions = this.getActions(menu);
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
