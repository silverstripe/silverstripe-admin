// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';

/**
 * Reduce an array of function names to an object of action that can pass to a component.
 * @param accumulator Current list of action
 * @param actionName Name of the new action to add.
 * @returns {[actionName]: function}
 */
const actionMaker = (accumulator, actionName) => {
  const fn = action(actionName);
  fn.toString = () => actionName;
  return { ...accumulator, [actionName]: fn };
};

/**
 * Create a list of story book actions.
 * @param string[] ...actionNames List of actions
 * @returns {[actionName]: function}
 */
const actionListMaker = (...actionNames) => (actionNames.reduce(actionMaker, {}));

export default actionListMaker;
