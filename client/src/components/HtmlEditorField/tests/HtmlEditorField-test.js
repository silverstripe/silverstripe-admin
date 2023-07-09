/* global jest, test, describe, it, expect */

import React from 'react';
import { render } from '@testing-library/react';
import HtmlEditorField from '../HtmlEditorField';

test('HtmlEditorField render() renders with editorjs', () => {
  const { container } = render(
    <HtmlEditorField {...{
      name: 'MyName',
      className: 'my-classname',
      data: {
        editorjs: 'I AM AN EDITOR_JS',
        attributes: {
          'data-abc': '123',
          'data-def': '456',
        }
      }
    }}
    />
  );
  expect(container.querySelectorAll('input')).toHaveLength(0);
});

test('HtmlEditorField render() renders without editorjs', () => {
  const { container } = render(
    <HtmlEditorField {...{
      name: 'MyName',
      className: 'my-classname',
      data: {
        editorjs: null,
        attributes: {
          'data-abc': '123',
          'data-def': '456',
        }
      }
    }}
    />
  );
  expect(container.querySelectorAll('input')).toHaveLength(1);
});
