/* global jest, test, describe, it, expect */
import React from 'react';
import { render } from '@testing-library/react';
import withSudoMode from '../SudoMode';

const sectionConfigKey = 'SilverStripe\\Admin\\SudoModeController';
const TestComponent = () => <div className="test-component" />;
const ComponentWithSudoMode = withSudoMode(TestComponent);

function resetWindowConfig(options) {
  const defaultOptions = {
    sudoModeActive: false,
    helpLink: null,
  };
  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };
  window.ss.config = {
    SecurityID: 1234567890,
    sections: [
      {
        name: sectionConfigKey,
        url: 'admin/sudomode',
        sudoModeActive: mergedOptions.sudoModeActive,
        endpoints: {
          activate: 'admin/sudomode/activate',
        },
        helpLink: mergedOptions.helpLink
      },
    ],
  };
}

test('SudoMode renders the wrapped component when sudo mode is active', () => {
  resetWindowConfig({ sudoModeActive: true });
  const { container } = render(<ComponentWithSudoMode />);
  expect(container.querySelector('.test-component')).not.toBeNull();
  expect(container.querySelector('.sudo-mode-password-field')).toBeNull();
});

test('SudoMode renders a sudo mode verification screen when sudo mode is inactive', () => {
  resetWindowConfig({ sudoModeActive: false });
  const { container } = render(<ComponentWithSudoMode />);
  expect(container.querySelector('.test-component')).toBeNull();
  expect(container.querySelector('.sudo-mode-password-field')).not.toBeNull();
});

test('SudoMode renders a notice', () => {
  resetWindowConfig({ sudoModeActive: false });
  const { container } = render(<ComponentWithSudoMode />);
  expect(container.querySelector('.sudo-mode-password-field__notice-message').textContent).toBe('Verify it\'s you first.');
});

test('SudoMode renders a help link when one is provided', () => {
  resetWindowConfig({ sudoModeActive: false, helpLink: 'http://google.com' });
  const { container } = render(<ComponentWithSudoMode />);
  expect(container.querySelector('.sudo-mode-password-field__notice-help').href).toBe('http://google.com/');
});
