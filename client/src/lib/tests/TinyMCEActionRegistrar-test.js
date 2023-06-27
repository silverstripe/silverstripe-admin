/* global jest, describe, afterEach, it, expect */

import TinyMCEActionRegistrar from '../TinyMCEActionRegistrar';

jest.unmock('../TinyMCEActionRegistrar.js');

describe('TinyMCEActionRegistrar', () => {
  describe('addCommandWithUrlTest method', () => {
    it('should return the default command when there\'s registered command', () => {
      const cmd = TinyMCEActionRegistrar.getEditorCommandFromUrl('http://googl.come/');
      expect(cmd).toBe('sslinkexternal');
    });

    it('should return the default command when there\'s no matched command', () => {
      TinyMCEActionRegistrar.addCommandWithUrlTest('sslinkemail', /^mailto:/);
      const cmd = TinyMCEActionRegistrar.getEditorCommandFromUrl('[sitetree_link,id=2]');
      expect(cmd).toBe('sslinkexternal');
    });

    it('should a matched command when there is one', () => {
      TinyMCEActionRegistrar.addCommandWithUrlTest('sslinkemail', /^mailto:/);
      TinyMCEActionRegistrar.addCommandWithUrlTest('sslinkfile', /^\[sitetree_link/);

      const cmdFile = TinyMCEActionRegistrar.getEditorCommandFromUrl('[sitetree_link,id=2]');
      expect(cmdFile).toBe('sslinkfile');

      const cmdEmail = TinyMCEActionRegistrar.getEditorCommandFromUrl('mailto:john.doe@test.com');
      expect(cmdEmail).toBe('sslinkemail');

      const cmdExt = TinyMCEActionRegistrar.getEditorCommandFromUrl('http://googl.come/');
      expect(cmdExt).toBe('sslinkexternal');
    });
  });

  describe('getSortedActions() should return sorted actions', () => {
    TinyMCEActionRegistrar.actions = {};
    TinyMCEActionRegistrar.addAction('menuTest', { text: 'Apple', priority: 10 });
    TinyMCEActionRegistrar.addAction('menuTest', { text: 'Two', priority: 50 });
    TinyMCEActionRegistrar.addAction('menuTest', { text: 'One', priority: 50 });
    TinyMCEActionRegistrar.addAction('menuTest', { text: 'Five', priority: 51 });

    const sortedActions = TinyMCEActionRegistrar.getSortedActions('menuTest');
    const output = sortedActions.map(item => item.text);
    expect(output).toEqual(['Five', 'One', 'Two', 'Apple']);
  });

  describe('getSortedActions() should allow filtering of global actions', () => {
    TinyMCEActionRegistrar.actions = {};
    TinyMCEActionRegistrar.addAction('menuTest', { text: 'Global1', priority: 10 });
    TinyMCEActionRegistrar.addAction('menuTest', { text: 'Global2', priority: 50 });
    TinyMCEActionRegistrar.addAction('menuTest', { text: 'Local1', priority: 100 }, 'special');
    TinyMCEActionRegistrar.addAction('menuTest', { text: 'Local2', priority: 150 }, 'special');

    let sortedActions;
    let output;
    // No config ID gets only global actions
    sortedActions = TinyMCEActionRegistrar.getSortedActions('menuTest');
    output = sortedActions.map(item => item.text);
    expect(output).toEqual(['Global2', 'Global1']);

    // With config id and includeGlobal=true gets everything
    sortedActions = TinyMCEActionRegistrar.getSortedActions('menuTest', 'special');
    output = sortedActions.map(item => item.text);
    expect(output).toEqual(['Local2', 'Local1', 'Global2', 'Global1']);

    // With config id and includeGlobal=false gets only special
    sortedActions = TinyMCEActionRegistrar.getSortedActions('menuTest', 'special', false);
    output = sortedActions.map(item => item.text);
    expect(output).toEqual(['Local2', 'Local1']);
  });
});
