import AsyncSelect from 'react-select/async';
import backend from 'lib/Backend';
import classNames from 'classnames';
import Config from 'lib/Config';
import debounce from 'debounce-promise';
import EmotionCssCacheProvider from 'containers/EmotionCssCacheProvider/EmotionCssCacheProvider';
import i18n from 'i18n';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import PropTypes from 'prop-types';
import React, { useState, useEffect, createRef } from 'react';
import Select from 'react-select';
import url from 'url';
import FormConstants from '../Form/FormConstants';

const SearchableDropdownField = ({
  clearable,
  disabled,
  lazyLoad,
  multi,
  passRef,
  placeholder,
  options,
  optionUrl,
  onChange,
  searchable,
  value,
  SelectComponent,
  AsyncSelectComponent,
  ...passThroughProps
}) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [justChanged, setJustChanged] = useState(false);
  const [fetchCache, setFetchCache] = useState({});
  const selectComponentRef = createRef();

  // This is required to get the PageForm change tracker to work by firing a bubbling change event
  useEffect(() => {
    if (!justChanged) {
      return;
    }
    const element = selectComponentRef.current.inputRef;
    const event = new Event('change', { bubbles: true });
    element.dispatchEvent(event);
    setJustChanged(false);
  });

  const fetchOptions = (term) => {
    if (fetchCache.hasOwnProperty(term)) {
      return Promise.resolve(fetchCache[term]);
    }
    let innerFetchOptions = () => {
      const fetchUrl = url.parse(optionUrl, true);
      if (fetchUrl.search) {
        // Remove the search key, though keep the query key
        // This is so url.format uses the query key instead of the search key below
        delete fetchUrl.search;
      }
      fetchUrl.query.term = term;
      const endpoint = url.format(fetchUrl);
      const csrfHeader = FormConstants.CSRF_HEADER;
      const headers = {};
      headers[csrfHeader] = Config.get('SecurityID');
      return backend.get(endpoint, headers)
        .then(response => response.json())
        .then(responseJson => {
          fetchCache[term] = responseJson;
          setFetchCache(fetchCache);
          return responseJson;
        });
    };
    innerFetchOptions = debounce(innerFetchOptions, 500);
    return innerFetchOptions();
  };

  /**
   * Get the options that should be shown to the user for this SearchableDropdownField,
   * optionally filtering by the given string input
   */
  const getOptions = (input) => {
    if (!lazyLoad) {
      return Promise.resolve(options);
    }
    if (!input) {
      return Promise.resolve([]);
    }
    return fetchOptions(input);
  };

  const handleChange = (val) => {
    setHasChanges(false);
    if (JSON.stringify(value) !== JSON.stringify(val)) {
      setHasChanges(true);
      setJustChanged(true);
    }
    onChange(val);
  };

  /**
   * Required to prevent SearchableDropdownField being cleared on blur
   *
   * @link https://github.com/JedWatson/react-select/issues/805#issuecomment-210646771
   */
  const handleOnBlur = () => {};

  const className = classNames({
    'no-change-track': !hasChanges,
    'ss-searchable-dropdown-field--lazy-load': lazyLoad
  });

  const optionsProps = lazyLoad ? { loadOptions: getOptions } : { options };

  const noOptionsMessage = (inputValue) => {
    if (inputValue) {
      return i18n._t('Admin.NO_MATCHING_OPTIONS', 'No matching options');
    }
    return i18n._t('Admin.TYPE_TO_SEARCH', 'Type to search');
  };

  // Setting passRef to false is purely for jest when mocking the component with a simple function component
  // It prevents - Warning: Function components cannot be given refs. Attempts to access this ref will fail.
  const refProps = passRef ? { ref: selectComponentRef } : {};

  let val = value;

  // For non-multi only the first value is needed
  if (!multi && val) {
    const keys = Object.keys(val);
    if (keys.length > 0) {
      const key = keys[0];
      const v = val[key];
      if (typeof v === 'object') {
        val = v;
      }
    }
  }

  const inputId = `${passThroughProps.id}__input`;

  const DynamicComponent = lazyLoad ? AsyncSelectComponent : SelectComponent;

  return <EmotionCssCacheProvider>
    <DynamicComponent
      // passThroughProps needs to be first so that it can be overridden by the other props
      {...passThroughProps}
      classNamePrefix="ss-searchable-dropdown-field"
      className={className}
      isClearable={clearable}
      isDisabled={disabled}
      isMulti={multi}
      isSearchable={searchable}
      placeholder={placeholder}
      onChange={handleChange}
      onBlur={handleOnBlur}
      {...optionsProps}
      noOptionsMessage={noOptionsMessage}
      {...refProps}
      value={val}
      inputId={inputId}
    />
  </EmotionCssCacheProvider>;
};

SearchableDropdownField.propTypes = {
  clearable: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  lazyLoad: PropTypes.bool.isRequired,
  multi: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.object),
  optionUrl: PropTypes.string,
  passRef: PropTypes.bool.isRequired,
  searchable: PropTypes.bool.isRequired,
  value: PropTypes.any,
  SelectComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
  AsyncSelectComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
};

SearchableDropdownField.defaultProps = {
  disabled: false,
  lazyLoad: false,
  clearable: true,
  searchable: true,
  multi: false,
  passRef: true,
  placeholder: '',
  onChange: () => {},
  value: '',
  SelectComponent: Select,
  AsyncSelectComponent: AsyncSelect,
};

export { SearchableDropdownField as Component };

export default fieldHolder(SearchableDropdownField);
