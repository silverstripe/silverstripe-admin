/* global jest, describe, it, expect */

import React from 'react';
import getDefaultActiveKey from '../getDefaultActiveKey';

const tabMaker = (...names) => names.map(name => <div name={name} />);

describe('getDefaultActiveKey', () => {
  it('default to first tab', () => {
    const children = tabMaker('expected', 'two', 'three');
    const actual = getDefaultActiveKey('no-match', children);

    expect(actual).toBe('expected');
  });

  it('match default active key', () => {
    const children = tabMaker('one', 'expected', 'three');
    const actual = getDefaultActiveKey('expected', children);

    expect(actual).toBe('expected');
  });

  it('no tab', () => {
    const actual = getDefaultActiveKey('no match', []);

    expect(actual).toBe('');
  });
});
