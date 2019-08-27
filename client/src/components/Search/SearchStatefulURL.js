import React from 'react';
import url from 'url';

const makeStateful = (Search) => class StatefulURLSearch extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.handlePopState = this.handlePopState.bind(this);
  }

  componentDidMount() {
    window.addEventListener('popstate', this.handlePopState);
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.handlePopState);
  }

  getQueryStringIdentifier() {
    return `${this.props.gridfield}__${this.props.name}`.replace(/[^A-Za-z0-9_]/g, '');
  }

  getTermFromURL() {
    const parsed = url.parse(window.location.href, true);
    if (parsed.query) {
      const json = parsed.query[this.getQueryStringIdentifier()];
      if (json) {
        const data = JSON.parse(json);
        return data[this.props.name];
      }
    }

    return null;
  }

  addFormDataToURL(formData) {
    const currentURL = window.location.href;
    const parsed = url.parse(currentURL, true);
    if (!parsed.query) {
      parsed.query = {};
    }
    parsed.query[this.getQueryStringIdentifier()] = JSON.stringify(formData);
    delete parsed.search;
    const newURL = url.format(parsed);

    return newURL;
  }

  handlePopState(event) {
    if (event.state.identifier && event.state.identifier === this.props.identifier) {
      const { formData } = event.state;
      this.doSearch(formData);
    }
  }

  handleSearch(formData) {
    const newURL = this.addFormDataToURL(formData);
    window.history.pushState(
      { identifier: this.props.identifier, formData },
      document.title,
      newURL
    );
    this.props.onSearch(formData);
  }

  render() {
      const term = this.getTermFromURL();
      return (<Search
        {...this.props}
        term={term}
        onSearch={this.handleSearch}
      />);
    }
  };

export default makeStateful;
