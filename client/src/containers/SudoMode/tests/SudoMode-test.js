/* global jest, describe, it, expect */
import fetch from 'isomorphic-fetch';
import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import withSudoMode from '../SudoMode';

Enzyme.configure({ adapter: new Adapter() });

jest.unmock('lib/Config');
jest.mock('isomorphic-fetch');

const sectionConfigKey = 'SilverStripe\\Admin\\SudoModeController';
const TestComponent = () => <div />;
const LoadingComponent = () => <div />;
let ComponentWithSudoMode = null;

describe('SudoMode', () => {
  beforeEach(() => {
    // Set window config
    window.ss.config = {
      SecurityID: 1234567890,
      sections: [
        {
          name: sectionConfigKey,
          url: 'admin/sudomode',
          sudoModeActive: false,
          endpoints: {
            activate: 'admin/sudomode/activate',
          },
        },
      ],
    };

    ComponentWithSudoMode = withSudoMode(TestComponent);
  });

  describe('render()', () => {
    it('renders the wrapped component when sudo mode is active', () => {
      window.ss.config.sections[0].sudoModeActive = true;
      const wrapper = shallow(
        <ComponentWithSudoMode />
      );

      expect(wrapper.find('TestComponent')).toHaveLength(1);
      expect(wrapper.find('.sudo-mode')).toHaveLength(0);
    });

    it('renders a sudo mode verification screen when sudo mode is inactive', () => {
      window.ss.config.sections[0].sudoModeActive = false;
      const wrapper = shallow(
        <ComponentWithSudoMode />
      );

      expect(wrapper.find('TestComponent')).toHaveLength(0);
      expect(wrapper.find('.sudo-mode')).toHaveLength(1);
    });
  });

  describe('renderSudoMode()', () => {
    it('renders a loading component', () => {
      const wrapper = shallow(
        <ComponentWithSudoMode
          LoadingComponent={LoadingComponent}
        />
      );
      wrapper.instance().setState({
        loading: true,
      });

      expect(wrapper.find('LoadingComponent')).toHaveLength(1);
    });

    it('renders a notice', () => {
      const wrapper = shallow(
        <ComponentWithSudoMode />
      );

      expect(wrapper.find('.sudo-mode__notice')).toHaveLength(1);
    });
  });

  describe('renderSudoModeNotice()', () => {
    it('renders a help link when one is provided', () => {
      window.ss.config.sections[0].helpLink = 'http://google.com';
      const wrapper = shallow(
        <ComponentWithSudoMode />
      );

      expect(wrapper.find('.sudo-mode__notice-help')).toHaveLength(1);
      expect(wrapper.find('.sudo-mode__notice-help').props().href).toBe('http://google.com');
    });

    it('doesn\'t render a help link when one is not provided', () => {
      window.ss.config.sections[0].helpLink = null;
      const wrapper = shallow(
        <ComponentWithSudoMode />
      );

      expect(wrapper.find('.sudo-mode__notice-help')).toHaveLength(0);
    });

    it('shows the verification screen when "Verify" is clicked', () => {
      const wrapper = shallow(
        <ComponentWithSudoMode />
      );

      expect(wrapper.find('.sudo-mode__notice-button')).toHaveLength(1);
      wrapper.find('.sudo-mode__notice-button').simulate('click');
      expect(wrapper.find('.sudo-mode__verify')).toHaveLength(1);
    });
  });

  describe('renderSudoModeVerification()', () => {
    it('renders a password field', () => {
      const wrapper = shallow(
        <ComponentWithSudoMode />
      );
      expect(wrapper.find('.sudo-mode__notice-button')).toHaveLength(1);
      wrapper.find('.sudo-mode__notice-button').simulate('click');

      expect(wrapper.find('#sudoModePassword')).toHaveLength(1);
    });
  });

  describe('handleVerify', () => {
    it('posts the request to be verified and returns the wrapped component on success', done => {
      // Mock a successful response from the API request
      fetch.mockClear();
      fetch.mockImplementation(() => Promise.resolve({
        status: 200,
        json: () => Promise.resolve({
          result: true,
        }),
      }));

      const wrapper = mount(
        <ComponentWithSudoMode
          LoadingComponent={LoadingComponent}
        />
      );

      // Confirm the notice
      expect(wrapper.find('Button.sudo-mode__notice-button')).toHaveLength(1);
      wrapper.find('Button.sudo-mode__notice-button').simulate('click');

      // Enter a password
      expect(wrapper.find('input#sudoModePassword')).toHaveLength(1);
      wrapper.find('input#sudoModePassword').getDOMNode().value = '0p3nS3samE!';

      // Click "Verify"
      expect(wrapper.find('Button.sudo-mode__verify-button')).toHaveLength(1);
      wrapper.find('Button.sudo-mode__verify-button').simulate('click');

      // Expect to see a loading indicator
      expect(wrapper.find('LoadingComponent')).toHaveLength(1);

      // Expect the request to be sent
      setTimeout(() => {
        expect(fetch).toHaveBeenCalledTimes(1);

        const mockedCall = fetch.mock.calls[0];
        expect(mockedCall[0]).toBe('admin/sudomode/activate');
        expect(mockedCall[1].method).toBe('POST');

        const expectedFormData = new FormData();
        expectedFormData.append('SecurityID', '1234567890');
        expectedFormData.append('Password', '0p3nS3samE!');
        expect(mockedCall[1].body).toEqual(expectedFormData);

        // Successful result, check wrapped component is rendered
        expect(wrapper.instance().state.active).toBe(true);
        expect(wrapper.instance().state.loading).toBe(false);
        done();
      });
    });

    it('posts the request to be verified and shows errors on failure', done => {
      // Mock a successful response from the API request
      fetch.mockClear();
      fetch.mockImplementation(() => Promise.resolve({
        status: 200,
        json: () => Promise.resolve({
          result: false,
          message: 'It broke because its a test.',
        }),
      }));

      const wrapper = mount(
        <ComponentWithSudoMode
          LoadingComponent={LoadingComponent}
        />
      );

      // Confirm the notice
      expect(wrapper.find('Button.sudo-mode__notice-button')).toHaveLength(1);
      wrapper.find('Button.sudo-mode__notice-button').simulate('click');

      // Enter a password
      expect(wrapper.find('input#sudoModePassword')).toHaveLength(1);
      wrapper.find('input#sudoModePassword').getDOMNode().value = 'wrongpassword';

      // Click "Verify"
      expect(wrapper.find('Button.sudo-mode__verify-button')).toHaveLength(1);
      wrapper.find('Button.sudo-mode__verify-button').simulate('click');

      // Expect to see a loading indicator
      expect(wrapper.find('LoadingComponent')).toHaveLength(1);

      // Expect the request to be sent
      setTimeout(() => {
        expect(fetch).toHaveBeenCalledTimes(1);

        const mockedCall = fetch.mock.calls[0];
        expect(mockedCall[0]).toBe('admin/sudomode/activate');
        expect(mockedCall[1].method).toBe('POST');

        const expectedFormData = new FormData();
        expectedFormData.append('SecurityID', '1234567890');
        expectedFormData.append('Password', 'wrongpassword');
        expect(mockedCall[1].body).toEqual(expectedFormData);

        // Failed to verify or activate, check that the error message is shown
        expect(wrapper.instance().state.active).toBe(false);
        expect(wrapper.instance().state.loading).toBe(false);
        expect(wrapper.text()).toContain('It broke because its a test.');
        done();
      });
    });
  });
});
