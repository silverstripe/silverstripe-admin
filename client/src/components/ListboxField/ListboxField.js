import React, { useState, useRef } from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import AsyncCreatableSelect from 'react-select/async-creatable';
import CreatableSelect from 'react-select/creatable';
import EmotionCssCacheProvider from 'containers/EmotionCssCacheProvider/EmotionCssCacheProvider';
import i18n from 'i18n';
import fetch from 'isomorphic-fetch';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import url from 'url';
import debounce from 'debounce-promise';
import PropTypes from 'prop-types';

const ListboxField = (_props) => {
  const defaultProps = {
    labelKey: 'Title',
    valueKey: 'Value',
    disabled: false,
    lazyLoad: false,
    creatable: false,
    multi: false,
    SelectComponent: Select,
    AsyncCreatableSelectComponent: AsyncCreatableSelect,
    AsyncSelectComponent: AsyncSelect,
    CreatableSelectComponent: CreatableSelect,
  };
  const props = {
    ...defaultProps,
    ..._props,
  };
  // Persist the latest props to simulate class component `this.props` behavior
  // and prevent stale closures
  const propsRef = useRef(props);
  // Update current props on each render before running any effects or callbacks
  propsRef.current = props;
  const [value, setValue] = useState(props.value);
  const debouncedFetchOptions = useRef(null);

  /**
   * Get the options that should be shown to the user for this ListboxField, optionally filtering by the
   * given string input
   *
   * @param {string} input
   * @return {Promise<Array<Object>>|Promise<{options: Array<Object>}>}
   */
  const getOptions = (input) => {
    const { lazyLoad, options } = props;

    if (!lazyLoad) {
      return Promise.resolve(options);
    }

    if (!input) {
      return Promise.resolve([]);
    }
    return debouncedFetchOptions.current(input);
  };

  /**
   * Determine if this input should be "controlled" or not. Controlled inputs should rely on their
   * value coming from props and a change handler provided to update the state stored elsewhere.
   * This is specifically the case for use with `redux-form`.
   *
   * @return {boolean}
   */
  const isControlled = () => typeof props.onChange === 'function';

  /**
   * Handle a change, either calling the change handler provided (if controlled) or updating
   * internal state of this component
   *
   * @param {string} value
   */
  const handleChange = (newValue) => {
    if (isControlled()) {
      props.onChange(newValue);
      return;
    }

    setValue(newValue);
  };

  /**
   * Required to prevent ListboxField being cleared on blur
   *
   * @link https://github.com/JedWatson/react-select/issues/805
   */
  const handleOnBlur = () => { };

  /**
   * Initiate a request to fetch options, optionally using the given string as a filter.
   *
   * @param {string} input
   * @return {Promise<{options: Array<Object>}>}
   */
  const fetchOptions = (input) => {
    const { optionUrl, labelKey, valueKey } = propsRef.current;
    const fetchURL = url.parse(optionUrl, true);
    fetchURL.query.term = input;

    return fetch(url.format(fetchURL), { credentials: 'same-origin' })
      .then((response) => response.json())
      .then((json) => json.items.map(
        (item) => ({
          [labelKey]: item.Title,
          [valueKey]: item.Value,
          Selected: item.Selected,
        })
      ));
  };

  if (!debouncedFetchOptions.current) {
    debouncedFetchOptions.current = debounce(fetchOptions, 500);
  }

  /**
   * Check if a value is in an array of options already
   * @param {string} value
   * @param {array} options
   * @param {string} valueKey
   * @returns {boolean}
   */
  const valueInOptions = (needle, options, valueKey) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of options) {
      if (needle === item[valueKey]) {
        return true;
      }
    }
    return false;
  };

  /**
   * Check if a new option can be created based on a given input
   * @param {string} inputValue
   * @param {array|object} value
   * @param {array} currentOptions
   * @returns {boolean}
   */
  const isValidNewOption = (inputValue, selectedValue, currentOptions) => {
    const { valueKey } = props;

    // Don't allow empty options
    if (!inputValue) {
      return false;
    }

    // Don't repeat the currently selected option
    if (Array.isArray(selectedValue)) {
      if (valueInOptions(inputValue, selectedValue, valueKey)) {
        return false;
      }
    } else if (inputValue === selectedValue[valueKey]) {
      return false;
    }

    // Don't repeat any existing option
    return !valueInOptions(inputValue, currentOptions, valueKey);
  };

  const {
    lazyLoad,
    options,
    creatable,
    multi,
    disabled,
    labelKey,
    valueKey,
    SelectComponent,
    AsyncCreatableSelectComponent,
    AsyncSelectComponent,
    CreatableSelectComponent,
    ...passThroughAttributes
  } = props;

  const optionAttributes = lazyLoad
    ? { loadOptions: getOptions }
    : { options };

  let DynamicSelect = SelectComponent;
  if (lazyLoad && creatable) {
    DynamicSelect = AsyncCreatableSelectComponent;
  } else if (lazyLoad) {
    DynamicSelect = AsyncSelectComponent;
  } else if (creatable) {
    DynamicSelect = CreatableSelectComponent;
  }

  // Update the value to passthrough with the kept state provided this component is not
  // "controlled"
  if (!isControlled()) {
    passThroughAttributes.value = value;
  }

  // if this is a single select then we just need the first value
  if (!multi && passThroughAttributes.value) {
    if (Object.keys(passThroughAttributes.value).length > 0) {
      const firstValue =
        passThroughAttributes.value[
          Object.keys(passThroughAttributes.value)[0]
        ];

      if (typeof firstValue === 'object') {
        passThroughAttributes.value = firstValue;
      }
    }
  }

  return (
    <EmotionCssCacheProvider>
      <DynamicSelect
        {...passThroughAttributes}
        isMulti={multi}
        isDisabled={disabled}
        cacheOptions
        onChange={handleChange}
        onBlur={handleOnBlur}
        {...optionAttributes}
        getOptionLabel={(option) => option[labelKey]}
        getOptionValue={(option) => option[valueKey]}
        noOptionsMessage={({ inputValue }) => (inputValue ? i18n._t('ListboxField.NO_OPTIONS', 'No options') : i18n._t('ListboxField.TYPE_TO_SEARCH', 'Type to search'))}
        isValidNewOption={isValidNewOption}
        getNewOptionData={(inputValue, label) => ({ [labelKey]: label, [valueKey]: inputValue })}
        classNamePrefix="ss-listbox-field"
      />
    </EmotionCssCacheProvider>
  );
};

ListboxField.propTypes = {
  name: PropTypes.string.isRequired,
  labelKey: PropTypes.string.isRequired,
  valueKey: PropTypes.string.isRequired,
  lazyLoad: PropTypes.bool,
  creatable: PropTypes.bool,
  multi: PropTypes.bool,
  disabled: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.object),
  optionUrl: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  SelectComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  AsyncCreatableSelectComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  AsyncSelectComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  CreatableSelectComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

export { ListboxField as Component };

export default fieldHolder(ListboxField);
