/* global window */
import React from 'react';
import Script from 'react-load-script';
import { Component as TextField } from 'components/TextField/TextField';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import 'events-polyfill';

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

    this.inputRef = null;

    this.handleReady = this.handleReady.bind(this);
  }

  getInputProps() {
    return {
      ...super.getInputProps(),
      ...this.props.data.attributes,
      innerRef: ref => { this.inputRef = ref; },
    };
  }

  getEditorElement() {
    return document.getElementById(this.getInputProps().id);
  }

  getEditor() {
    return window.TinyMCE && window.TinyMCE.get(this.getInputProps().id);
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
   * Forces the editor to invoke a change on the InputField
   */
  registerChangeListener() {
    const target = this.getEditorElement();
    this.getEditor().on('change keyup setcontent', () => {
      super.handleChange({ target });
    });
  }

  /**
   * TinyMCE operates from a global script being loaded in first.
   * We must ensure this dependency is loaded before proceeding to
   * render the editor proper
   */
  renderDependencyScript() {
    if (!window.tinymce && !window.TinyMCE) {
      return <Script url={this.props.data.editorjs} onLoad={this.handleReady} />;
    }
    // If the script is already loaded, mark as ready after this render cycle finishes.
    setTimeout(() => {
      this.handleReady();
    }, 0);
    return null;
  }

  render() {
    return (this.state.isReady) ? super.render() : this.renderDependencyScript();
  }

  /**
   * When the handleReady callback is run, the state is changed.
   * This state change triggers the render of the .htmleditor element
   * however since this is not added by entwine, the entwine hook for
   * onadd is not run - we must trigger this manually.
   */
  componentDidUpdate(prevProps, prevState) {
    const { isReady } = this.state;

    if (!isReady) {
      return;
    }

    if (isReady !== prevState.isReady) {
      setTimeout(() => {
        const { document, jQuery: $ } = window;
        const mountEvent = $ ? $.Event('EntwineElementsAdded') : new Event('noop');
        const editorElement = this.getEditorElement();
        mountEvent.targets = [editorElement];
        if ($) {
          $(document).triggerHandler(mountEvent);
        }
        this.registerChangeListener();
      }, 1);
    }

    const { value } = this.props;

    if (value !== prevProps.value) {
      const event = new Event('change', { bubbles: true });
      event.simulated = true;
      event.value = value;
      this.inputRef.dispatchEvent(event);
    }
  }

  componentWillUnmount() {
    if (!this.state.isReady) {
      return;
    }

    const { document, jQuery: $ } = window;
    const unmountEvent = $ ? $.Event('EntwineElementsRemoved') : new Event('noop');
    const editorElement = this.getEditorElement();
    // Tell tinyMCE to persist changes into the text field
    const editor = this.getEditor();
    if (editor) {
      editor.save();
    }
    unmountEvent.targets = [editorElement];
    // Ensure that redux knows of the latest changes before the editor is destroyed.
    // This is pretty awful because TinyMCE triggers jQuery events which aren't picked up
    // by the react components. We also can't manufacture an event with the right target
    // without actually dispatching the event, and by then it's too late.
    super.handleChange({ target: editorElement });
    if ($) {
      $(document).triggerHandler(unmountEvent);
    }
  }
}

export { HtmlEditorField as Component };

export default fieldHolder(HtmlEditorField);
