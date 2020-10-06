/* global jest, describe, it, expect */

import React from 'react';
import HtmlEditorField from '../HtmlEditorField';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build/index';

Enzyme.configure({ adapter: new Adapter() });

const errorSpy = jest.spyOn(global.console, 'error');
const warnSpy = jest.spyOn(global.console, 'warn');

const props = {
  name: 'MyName',
  className: 'my-classname',
  data: {
    editorjs: 'I AM AN EDITOR_JS',
    attributes: {
      'data-abc': '123',
      'data-def': '456',
    }
  }
};

describe('HtmlEditorField', () => {
  describe('render()', () => {
    beforeEach(() => {
      errorSpy.mockClear();
      warnSpy.mockClear();
    });

    it('renders with editorjs', () => {
      const reactWrapper = mount(
        <HtmlEditorField {...props} />
      );

      expect(reactWrapper.find('input')).toHaveLength(0);
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('renders without editorjs', () => {
      const props2 = { ...props, data: { ...props.data, editorjs: null } };
      const reactWrapper = mount(
        <HtmlEditorField {...props2} />
      );

      expect(reactWrapper.find('input')).toHaveLength(1);
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });
});
