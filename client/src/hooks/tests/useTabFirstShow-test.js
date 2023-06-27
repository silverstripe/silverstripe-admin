/* global jest, test, describe, it, expect */

import React from 'react';
import { Component as Tabs } from 'components/Tabs/Tabs';
import TabItem from 'components/Tabs/TabItem';
import { render } from '@testing-library/react';
import { useTabFirstShow } from '../useTabContext';

const TabContextPrinter = ({ callback }) => {
  useTabFirstShow(callback);
  return <div />;
};

test('useTabFirstShow not in any tab', () => {
  const callback = jest.fn();
  render(<TabContextPrinter callback={callback} />);
  expect(callback).toBeCalledWith(false);
});

test('useTabFirstShow in active tab', () => {
  const callback = jest.fn();
  render(
    <Tabs id="foo" activeTab="active" activateTab={() => (false)}>
      <TabItem name="active">
        <TabContextPrinter callback={callback} />
      </TabItem>
    </Tabs>
  );
  expect(callback).toBeCalledWith({
    activeTab: 'active',
    currentTab: 'active',
    isOnActiveTab: true
  });
});

test('useTabFirstShow outside active tab', async () => {
  const callback = jest.fn();
  render(
    <Tabs id="foo" activeTab="active" activateTab={() => (false)}>
      <TabItem name="active"/>
      <TabItem name="secondary">
        <TabContextPrinter callback={callback}/>
      </TabItem>
    </Tabs>
  );
  expect(callback).not.toBeCalled();
});

test('useTabFirstShow inside inactive tab', () => {
  const callback = jest.fn();
  render(
    <Tabs id="foo" activeTab="secondary" activateTab={() => (false)}>
      <TabItem name="active" />
      <TabItem name="secondary">
        <Tabs id="bar" activeTab="subactive" activateTab={() => (false)}>
          <TabItem name="subactive">
            <TabContextPrinter callback={callback} />
          </TabItem>
        </Tabs>
      </TabItem>
    </Tabs>
  );
  expect(callback).toBeCalledWith({
    activeTab: 'subactive',
    currentTab: 'subactive',
    isOnActiveTab: true
  });
});

test('useTabFirstShow inside inactive tab', () => {
  const callback = jest.fn();
  render(
    <Tabs id="foo" activeTab="secondary" activateTab={() => (false)}>
      <TabItem name="active" />
      <TabItem name="secondary">
        <Tabs id="bar" activeTab="subactive" activateTab={() => (false)}>
          <TabItem name="subactive" />
          <TabItem name="subinactive">
            <TabContextPrinter callback={callback} />
          </TabItem>
        </Tabs>
      </TabItem>
    </Tabs>
  );
  expect(callback).not.toBeCalled();
});
