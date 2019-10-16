import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf, setAddon } from '@storybook/react';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs/react';
import JSXAddon from 'storybook-addon-jsx';
import { action } from '@storybook/addon-actions';
import Button from '../Button';
import BackButton from '../BackButton';


const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'link'];
const sizes = ['sm', 'md', 'lg'];
const icons = ['', 'search', 'sync', 'plus-circled', 'cancel-circled', 'check-mark', 'edit'];

const onClick = (event) => {
  event.preventDefault();
  return action('onClick')(event);
};
onClick.toString = () => 'onClick';


setAddon(JSXAddon);

storiesOf('Admin/Button', module)
  .addDecorator(story => <div style={{ width: '100%' }}>{story()}</div>)
  .addDecorator(withKnobs)
  .addWithJSX('Button', () => (
    <Button
      color={select('color', colors, 'primary')}
      size={select('size', sizes, 'md')}
      icon={select('icon', icons, '')}
      outline={boolean('outline', false)}
      block={boolean('block', false)}
      active={boolean('active', false)}
      disabled={boolean('disabled', false)}
      noText={boolean('noText', false)}
      onClick={onClick}
      className={text('className', '')}
    >{text('children', 'click me')}</Button>
  ))
  .addWithJSX('BackButton', () => (
    <BackButton
      className={text('className', '')}
      onClick={onClick}
    >{text('children', 'Back')}</BackButton>
  ));
