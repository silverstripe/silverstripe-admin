import defaultTagHandlers from './defaultTagHandlers';

/**
 * Can be use with `Array.reduce()` to convert a list of tags to a string.
 * @param accumulator
 * @param key
 * @param value
 * @param label
 * @returns string
 */
const tagListReducer = (accumulator, { key, value, label }) => (
  `${accumulator}${label.toLowerCase() || key} ${value || ''} `
);

/**
 * Given a form schema generate an array of tag data suitable to be rendered via `<TagList/>`
 */
const mapFormSchemaToTags = (formSchema, formData, tagHandlerOverrides = {}) => {
  // if the form schema is still loading, let's bail
  if (formSchema.metadata.loading) {
    return {};
  }

  /**
   * Customise list of method to convert fields to tags.
   */
  let tagHandlers;

  /**
   * Convert a field to the equivalent tag
   * @param field
   * @returns {*}
   */
  const fieldToTag = (field) => {
    const tag = {
      key: field.name,
      label: field.title,
      value: formData[field.name]
    };

    let handler;
    if (typeof tagHandlers[`#${tag.key}`] === 'function') {
      handler = tagHandlers[`#${tag.key}`];
    } else if (typeof tagHandlers[field.schemaType] === 'function') {
      handler = tagHandlers[field.schemaType];
    } else {
      handler = tagHandlers.default;
    }

    return handler(tag, field, formSchema, formData);
  };

  /**
   *
   * @param tag
   * @param field
   * @returns {boolean}
   */
  const structuralTagHandler = (tag, field) => {
    const { children } = field;

    // If we don't have valid children, do not output a tag.
    if (!Array.isArray(children) || children.length === 0) {
      return false;
    }

    // Reduce the value of the children field into the main tag
    const value = children
      .map(fieldToTag)
      .filter(subTag => (subTag !== false))
      .reduce(tagListReducer, '')
      .trim();
    const linkedFields = children.map(linkedField => linkedField.name);
    const focusSelector = `[name=${children[0].name}]`;

    return value ? Object.assign({}, tag, { value, linkedFields, focusSelector }) : false;
  };

  tagHandlers = Object.assign(
    {},
    defaultTagHandlers,
    { Structural: structuralTagHandler },
    tagHandlerOverrides
  );

  const fields = formSchema.schema.fields;

  const tags = fields.map(fieldToTag).filter(tag => (tag !== false));

  const keyedTags = {};
  tags.forEach(tag => { keyedTags[tag.key] = tag; });

  return keyedTags;
};

export default mapFormSchemaToTags;
