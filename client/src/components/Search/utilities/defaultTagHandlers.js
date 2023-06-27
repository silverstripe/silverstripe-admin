import genericDateTagHandler from './genericDateTagHandler';

/**
 * Convert values from a select field to their equivalent title.
 * @param string key Name of the field.
 * @param string[] values List of selected values.
 * @param Object formSchema FormSchema stored in the redux-form state.
 * @returns string|false Textual representation of the selected values or `false`
 * if a textual representation can not be created.
 */
const selectTagHandler = (key, values, formSchema) => {
  // Make sure the provided values are a non empty array
  if (!Array.isArray(values) || values.length === 0) {
    return false;
  }

  // Isolate the field state from the form schema for our provided key
  const fieldState = formSchema.state.fields.find(({ name }) => (name === key));

  if (fieldState && fieldState.source) {
    // Convert our values to their display title equivalent.
    const labelValue = values.map((selectedValue) => {
      const sourceEntry = fieldState.source.find(
        ({ value }) => value.toString() === selectedValue.toString()
      );
      return sourceEntry && sourceEntry.title ?
        sourceEntry.title :
        selectedValue;
    }).join(', ');

    return labelValue || false;
  }

  return false;
};

/**
 * Tag Handlers that will be use to generate tags for specific field.
 *
 * Each handler should use the following signature:
 * `(tag, field, formSchema, formData) => {enrichedTag|false}`
 * * `tag` provide raw tag data. It will contain `key`, `label` and `value` attributes.
 * * `field` provides a representation of the field contain in the redux-form schema.
 * * `formSchema` is the redux-form schema for the current form.
 * * `formData` is the data for the current redux-form.
 *
 * If the handler returns `false`, no tag will be generated for this field. Otherwise an
 * `enrichedTag` object should be returned with the following attributes.
 * * `key`: unique identifier for the field (mandatory),
 * * `label`: String to display in the tag (defaults to `key` if not provided),
 * * `value`: The value to attach to the tag, can be left undefined if the tag should be
 * valueless,
 * * `focusSelector`: Selector used to identified the form field that should be focus on when
 * the user clicks the tag. If left undefined, they `key` will be used to build the selector.
 * * `linkedFields`: An array of formData keys that should be cleared when the tag is dismissed. If
 * not provided, `key` will be used to determined which attribute should be cleared from formData.
 *
 */
const defaultTagHandlers = {
  Date: genericDateTagHandler('ll'),
  Time: genericDateTagHandler('LT'),
  Datetime: genericDateTagHandler('lll'),
  Hidden: () => false,
  SingleSelect: (tag, field, formSchema) => {
    if (typeof tag.value === 'undefined') {
      return false;
    }

    const value = selectTagHandler(tag.key, [tag.value], formSchema);
    return value ? Object.assign({}, tag, { value }) : false;
  },
  Boolean: (tag) => {
    if (tag.value) {
      const { value, ...valuelessTag } = tag;
      return valuelessTag;
    }
    return false;
  },
  MultiSelect: (tag, field, formSchema) => {
    const value = selectTagHandler(tag.key, tag.value, formSchema);
    return value ? Object.assign({}, tag, { value }) : false;
  },
  default: (tag) => (tag.value ? tag : false)
};

export default defaultTagHandlers;
