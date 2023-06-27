/* global jest, test, describe, it, expect */
import React from 'react';
import fetch from 'isomorphic-fetch';
import { fireEvent, render, screen } from '@testing-library/react';
import withSudoMode from '../SudoMode';

jest.mock('isomorphic-fetch');

const sectionConfigKey = 'SilverStripe\\Admin\\SudoModeController';
const TestComponent = () => <div className="test-component" />;
const LoadingComponent = () => <div className="loading-component" data-testid="loading-component" />;
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
  expect(container.querySelector('.sudo-mode')).toBeNull();
});

test('SudoMode renders a sudo mode verification screen when sudo mode is inactive', () => {
  resetWindowConfig({ sudoModeActive: false });
  const { container } = render(<ComponentWithSudoMode />);
  expect(container.querySelector('.test-component')).toBeNull();
  expect(container.querySelector('.sudo-mode')).not.toBeNull();
});

test('SudoMode renders a notice', () => {
  resetWindowConfig({ sudoModeActive: false });
  const { container } = render(<ComponentWithSudoMode />);
  expect(container.querySelector('.sudo-mode__notice')).not.toBeNull();
});

test('SudoMode renders a loading component after entering password and clicking verify', async () => {
  fetch.mockClear();
  fetch.mockImplementation(() => Promise.resolve({
    status: 200,
    json: () => Promise.resolve({
      result: true,
    }),
  }));
  resetWindowConfig({ sudoModeActive: false });
  const { container } = render(
    <ComponentWithSudoMode {...{
      LoadingComponent
    }}
    />
  );
  fireEvent.click(container.querySelector('.sudo-mode__notice-button'));
  fireEvent.change(container.querySelector('#sudoModePassword'), {
    target: { value: 'password' }
  });
  fireEvent.click(container.querySelector('.sudo-mode__verify-button'));
  expect(await screen.findByTestId('loading-component')).not.toBeNull();
});

test('SudoMode renders a help link when one is provided', () => {
  resetWindowConfig({ sudoModeActive: false, helpLink: 'http://google.com' });
  const { container } = render(<ComponentWithSudoMode />);
  expect(container.querySelector('.sudo-mode__notice-help').href).toBe('http://google.com/');
});

test('Sudo mode shows errors on failure', async () => {
  resetWindowConfig({ sudoModeActive: false });
  fetch.mockClear();
  fetch.mockImplementation(() => Promise.resolve({
    status: 200,
    json: () => Promise.resolve({
      result: false,
      message: 'It broke because its a test.',
    }),
  }));
  const { container } = render(
    <ComponentWithSudoMode {...{
      LoadingComponent
    }}
    />
  );
  fireEvent.click(container.querySelector('.sudo-mode__notice-button'));
  fireEvent.change(container.querySelector('#sudoModePassword'), {
    target: { value: 'password' }
  });
  fireEvent.click(container.querySelector('.sudo-mode__verify-button'));
  await screen.findByTestId('loading-component');
  expect(container.querySelector('.invalid-feedback').innerHTML).toBe('It broke because its a test.');
});
