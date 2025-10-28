/* global jest, test, expect */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TabItem from '../TabItem';
import { TabContext } from '../../../hooks/useTabContext';

const makeProps = (overrides = {}) => ({
  name: 'tab1',
  className: '',
  extraClass: '',
  disabled: false,
  children: <div>Test Content</div>,
  ...overrides,
});

const renderWithContext = (component, contextValue = {}) => {
  const defaultContextValue = {
    activeTab: 'tab1',
    isOnActiveTab: true,
    ...contextValue,
  };
  return render(
    <TabContext.Provider value={defaultContextValue}>
      {component}
    </TabContext.Provider>
  );
};

test('TabItem applies both className and extraClass', () => {
  const props = makeProps({ className: 'custom', extraClass: 'extra' });
  const { container } = renderWithContext(<TabItem {...props} />);
  const tabPane = container.firstChild;
  expect(tabPane.classList.contains('custom')).toBe(true);
  expect(tabPane.classList.contains('extra')).toBe(true);
});

test('TabItem passes disabled prop to TabPane', () => {
  const props = makeProps({ disabled: true });
  const { container } = renderWithContext(<TabItem {...props} />);
  const tabPane = container.querySelector('[disabled]');
  expect(tabPane).not.toBeNull();
});

test('TabItem provides context to nested components', () => {
  const TestChild = () => {
    const { activeTab, currentTab } = React.useContext(TabContext);
    return (
      <div>
        <span data-testid="active">{activeTab}</span>
        <span data-testid="current">{currentTab}</span>
      </div>
    );
  };
  const props = makeProps({ children: <TestChild /> });
  renderWithContext(<TabItem {...props} />, { activeTab: 'tab1', isOnActiveTab: true });
  expect(screen.getByTestId('active').textContent).toBe('tab1');
  expect(screen.getByTestId('current').textContent).toBe('tab1');
});

test('TabItem sets isOnActiveTab to true when parent is active', () => {
  const TestChild = () => {
    const { isOnActiveTab } = React.useContext(TabContext);
    return <span data-testid="active-status">{isOnActiveTab.toString()}</span>;
  };
  const props = makeProps({ children: <TestChild /> });
  renderWithContext(<TabItem {...props} />, { activeTab: 'tab1', isOnActiveTab: true });
  expect(screen.getByTestId('active-status').textContent).toBe('true');
});

test('TabItem sets isOnActiveTab to false when parent is not active', () => {
  const TestChild = () => {
    const { isOnActiveTab } = React.useContext(TabContext);
    return <span data-testid="active-status">{isOnActiveTab.toString()}</span>;
  };
  const props = makeProps({ children: <TestChild /> });
  renderWithContext(<TabItem {...props} />, { activeTab: 'tab2', isOnActiveTab: false });
  expect(screen.getByTestId('active-status').textContent).toBe('false');
});

test('TabItem sets isOnActiveTab to false when nested tab is not active', () => {
  const TestChild = () => {
    const { isOnActiveTab } = React.useContext(TabContext);
    return <span data-testid="active-status">{isOnActiveTab.toString()}</span>;
  };
  const props = makeProps({ children: <TestChild /> });
  renderWithContext(<TabItem {...props} />, { activeTab: 'tab1', isOnActiveTab: false });
  expect(screen.getByTestId('active-status').textContent).toBe('false');
});

test('TabItem renders children content', () => {
  const props = makeProps({ children: <div>Custom Content</div> });
  renderWithContext(<TabItem {...props} />);
  expect(screen.getByText('Custom Content')).not.toBeNull();
});

test('TabItem sets tabindex="0" on tab pane when no focusable elements exist', async () => {
  const props = makeProps({ children: <div>Static Content</div> });
  const { container } = renderWithContext(<TabItem {...props} />);
  const fadeElement = container.querySelector('[class*="fade"]');
  const tabPane = fadeElement?.parentNode;
  await waitFor(() => {
    expect(tabPane?.getAttribute('tabindex')).toBe('0');
  });
});

test('TabItem does not set tabindex when focusable link exists', async () => {
  const props = makeProps({ children: <a href="#test">Link</a> });
  const { container } = renderWithContext(<TabItem {...props} />);
  const fadeElement = container.querySelector('[class*="fade"]');
  const tabPane = fadeElement?.parentNode;
  await waitFor(() => {
    expect(tabPane?.getAttribute('tabindex')).toBeNull();
  });
});

test('TabItem does not set tabindex when focusable button exists', async () => {
  const props = makeProps({ children: <button>Click me</button> });
  const { container } = renderWithContext(<TabItem {...props} />);
  const fadeElement = container.querySelector('[class*="fade"]');
  const tabPane = fadeElement?.parentNode;
  await waitFor(() => {
    expect(tabPane?.getAttribute('tabindex')).toBeNull();
  });
});

test('TabItem does not set tabindex when focusable input exists', async () => {
  const props = makeProps({ children: <input type="text" /> });
  const { container } = renderWithContext(<TabItem {...props} />);
  const fadeElement = container.querySelector('[class*="fade"]');
  const tabPane = fadeElement?.parentNode;
  await waitFor(() => {
    expect(tabPane?.getAttribute('tabindex')).toBeNull();
  });
});

test('TabItem ignores disabled button and sets tabindex', async () => {
  const props = makeProps({ children: <button disabled>Disabled</button> });
  const { container } = renderWithContext(<TabItem {...props} />);
  const fadeElement = container.querySelector('[class*="fade"]');
  const tabPane = fadeElement?.parentNode;
  await waitFor(() => {
    expect(tabPane?.getAttribute('tabindex')).toBe('0');
  });
});
