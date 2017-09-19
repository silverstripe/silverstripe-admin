/* global window */
/**
 * Provides methods for interacting with the client config.
 * The client config is defined using the YAML/PHP config system.
 * Please use the Redux state.config structure where possible instead of this.
 * Relies on DOMContentLoaded, since the window.ss.config global is currently
 * set via a <script> tag.
 *
 * @class
 */
class Config {
  /**
   * Get a specific key from the configuration object.
   *
   * @param  {String} key
   * @return {mixed}
   */
  static get(key) {
    return window.ss.config[key];
  }

  /**
   * The the whole configuration object.
   *
   * @return {Object}
   */
  static getAll() {
    return window.ss.config;
  }

  /**
   * Gets the the config for a specific section.
   *
   * @param string key - The section config key.
   *
   * @return object|undefined
   */
  static getSection(key) {
    return window.ss.config.sections.find((section) => section.name === key);
  }

  /**
   * Gets the key of the current CMS section
   */
  static getCurrentSection() {

  }
}

export default Config;
