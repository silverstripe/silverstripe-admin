/* global jest, jasmine, describe, beforeEach, it, pit, expect, process */

jest.dontMock('../ShortcodeSerialiser.js');

// FYI: Changing this to an import statements broke jest's automocking
const ShortcodeSerialiser = require('../ShortcodeSerialiser.js').default;

describe('ShortcodeSerialiser', () => {
  describe('match', () => {
    it('Matches unwrapped shortcodes', () => {
      // Test normal version
      const result1 = ShortcodeSerialiser.match(
        'image',
        false,
        '<p>[image id=4 alt="text" name=\'some text\']</p>'
      );
      expect(result1.name).toBe('image');
      expect(result1.original).toBe('[image id=4 alt="text" name=\'some text\']');
      expect(result1.properties).toEqual({
        id: '4',
        alt: 'text',
        name: 'some text',
      });
      expect(result1.content).toBe(null);
      expect(result1.wrapped).toBe(false);

      // Doesn't incorrectly match other tags
      const result2 = ShortcodeSerialiser.match(
        'image',
        false,
        '<p>[page id=4 alt="text" name=\'some text\']</p>'
      );
      expect(result2).toBe(null);
    });

    it('Matches wrapped shortcodes', () => {
      // Test normal version
      const result1 = ShortcodeSerialiser.match(
        'image',
        true,
        '<p>[image id=4 alt="text" name=\'some text\']Content in here[/image]</p>'
      );
      expect(result1.name).toBe('image');
      expect(result1.original).toBe(
        '[image id=4 alt="text" name=\'some text\']Content in here[/image]'
      );
      expect(result1.properties).toEqual({
        id: '4',
        alt: 'text',
        name: 'some text',
      });
      expect(result1.content).toBe('Content in here');
      expect(result1.wrapped).toBe(true);

      // Doesn't match only partial tag
      const result2 = ShortcodeSerialiser.match(
        'image',
        true,
        '<p>[image id=4 alt="text" name=\'some text\']Content in here</p>'
      );
      expect(result2).toBe(null);
    });

    it('Matches inline shortcodes', () => {
      const result1 = ShortcodeSerialiser.match(
        'page',
        false,
        '<p><a href="[page,id=\'4\',title=\'some%20title\']">Link here!</a></p>'
      );
      expect(result1.name).toBe('page');
      expect(result1.original).toBe('[page,id=\'4\',title=\'some%20title\']');
      expect(result1.properties).toEqual({
        id: '4',
        title: 'some%20title',
      });
      expect(result1.content).toBe(null);
      expect(result1.wrapped).toBe(false);
    });

    it('Matches only the first shortcode', () => {
      // Test normal version
      const result1 = ShortcodeSerialiser.match(
        'image',
        false,
        '<p>[image id=4 alt="text" name=\'some text\']</p><p>[image id=5]</p>'
      );
      expect(result1.name).toBe('image');
      expect(result1.original).toBe('[image id=4 alt="text" name=\'some text\']');
    });
  });

  describe('serialise', () => {
    it('Can serialise an unwrapped object', () => {
      // Ensure quote character is stripped
      const result = ShortcodeSerialiser.serialise({
        name: 'image',
        wrapped: false,
        properties: {
          id: '4',
          title: '\'some\' "title"',
        },
      });
      expect(result).toBe('[image id="4" title="\'some\' title"]');
    });

    it('Can serialise a wrapped object', () => {
      // Ensure quote character is stripped
      const result = ShortcodeSerialiser.serialise({
        name: 'image',
        wrapped: true,
        content: 'Some content here',
        properties: {
          id: '4',
          title: '\'some\' "title"',
        },
      });
      expect(result).toBe('[image id="4" title="\'some\' title"]Some content here[/image]');
    });

    it('Can serialise an unwrapped object with attributesafe', () => {
      // Ensure quote character is stripped
      const result = ShortcodeSerialiser.serialise({
        name: 'image',
        wrapped: false,
        properties: {
          id: '4',
          title: '\'some\' "title"',
        },
      }, true);
      expect(result).toBe('[image,id=4,title=sometitle]');
    });

    it('Can serialise a wrapped object with attributesafe', () => {
      // Ensure quote character is stripped
      const result = ShortcodeSerialiser.serialise({
        name: 'image',
        wrapped: true,
        content: 'Some content here',
        properties: {
          id: '4',
          title: '\'some\' "title"',
        },
      }, true);
      expect(result).toBe('[image,id=4,title=sometitle]Some content here[/image]');
    });
  });
});
