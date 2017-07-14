/* global jest, describe, beforeEach, it, expect */

jest.unmock('react');
jest.unmock('react-addons-test-utils');
jest.unmock('../castStringToElement');

import castStringToElement, { mapHighlight } from '../castStringToElement';
import CompositeField from 'components/CompositeField/CompositeField';

describe('castStringToElement', () => {
  it('should render a simple div with string', () => {
    const Element = castStringToElement('div', 'My div');
    expect(Element.type).toEqual('div');
    expect(Element.props.children).toEqual('My div');
  });

  it('should render a simple div with string given an object', () => {
    const Element = castStringToElement('div', { text: 'My div in an object' });

    expect(Element.type).toEqual('div');
    expect(Element.props.children).toEqual('My div in an object');
  });

  it('should render a CompositeField with string', () => {
    const Element = castStringToElement(CompositeField, 'My string content');

    expect(Element.type.name).toEqual('CompositeField');
    expect(Element.props.children).toEqual('My string content');
  });

  it('should render a CompositeField with setInnerHtml given an object', () => {
    const Element = castStringToElement(
      CompositeField,
      { html: '<div>My div content in something</div>' }
    );

    expect(Element.type.name).toEqual('CompositeField');
    expect(Element.props.dangerouslySetInnerHTML)
      .toEqual({ __html: '<div>My div content in something</div>' });
  });
});

describe('mapHighlight', () => {
  it('should return an array of parts that match', () => {
    const term = 'banAna';
    const search = 'an';

    const results = mapHighlight(term, search);

    expect(results).toEqual(['b', 'an', 'An', 'a']);
  });

  it('should return an array with react tag if matched', () => {
    const term = 'banAna';
    const search = 'an';

    const results = mapHighlight(term, search, 'b');

    expect(results[0]).toBe('b'); // , 'an', 'An', 'a']);
    expect(typeof results[1]).toBe('object');
    expect(results[1].props.children).toBe('an');
    expect(typeof results[2]).toBe('object');
    expect(results[2].props.children).toBe('An');
    expect(results[3]).toBe('a');
  });
});
