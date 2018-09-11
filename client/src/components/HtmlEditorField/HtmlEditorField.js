/* global window */
import React from 'react';
import Script from 'react-load-script';
import { Component as TextField } from 'components/TextField/TextField';
import fieldHolder from 'components/FieldHolder/FieldHolder';


class HtmlEditorField extends TextField {
  /**
   * sets initial state:
   * if editorjs IS defined, we are NOT ready (must check dependency first).
   * if editorjs is NOT defined, we ARE ready (no dependency).
   */
  constructor(props) {
    super(props);
    this.state = {
        isReady: !props.data.editorjs
    };
    this.handleReady = this.handleReady.bind(this);
  }

  getInputProps() {
    return {
      ...super.getInputProps(),
      ...this.props.data.attributes,
    };
  }

  /**
   * Once the dependency script is loaded, updating the internal state
   * will trigger a reload and present the editor to the user
   */
  handleReady() {
    if (!window.TinyMCE && window.tinymce) {
      window.TinyMCE = window.tinymce;
    }
    this.setState({ isReady: true });
  }

  /**
   * TinyMCE operates from a global script being loaded in first.
   * We must ensure this dependency is loaded before proceeding to
   * render the editor proper
   */
  renderDependencyScript() {
    return <Script url={this.props.data.editorjs} onLoad={this.handleReady} />;
  }

  /**
   * Renders the rich text editor (TinyMCE)
   * Happens only after the dependency script has been loaded
   */
  renderRichTextEditor() {
    const config = JSON.parse(this.props.data.attributes['data-config']);
    return super.render(config);
  }

  render() {
    return (this.state.isReady) ? this.renderRichTextEditor() : this.renderDependencyScript();
  }

  /**
   * When the handleReady callback is run, the state is changed.
   * This state change triggers the render of the .htmleditor element
   * however since this is not added by entwine, the entwine hook for
   * onadd is not run - we must trigger this manually.
   */
  componentDidUpdate() {
    if (this.state.isReady) {
      const { document, jQuery: $ } = window;
      const mountEvent = $.Event('EntwineElementsAdded');
      const editorElement = document.getElementById(this.getInputProps().id);
      mountEvent.targets = [editorElement];
      $(document).triggerHandler(mountEvent);
    }
  }
}

export { HtmlEditorField as Component };

export default fieldHolder(HtmlEditorField);
