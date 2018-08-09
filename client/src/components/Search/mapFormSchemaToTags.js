/**
 * Given a form schema generate an array of tag data suitable to be rendered via `<TagList/>`
 */
const mapFormSchemaToTags = (formSchema, formData) => {
  if (formSchema.metadata.loading) {
    // if the form schema is still loading, let's bail
    return [];
  }

  const fields = formSchema.schema.fields;
  const fieldStates = formSchema.state.fields;
  const fieldOverrides = formSchema.stateOverride ? formSchema.stateOverride.fields : [];

  const tags = fields.map( field => ({
    key: field.name,
    label: field.title,
    schemaType: field.schemaType
  })).map( ({schemaType, ...tag}) => {
      let value;

      switch(schemaType) {
        default:
          if (formData[tag.key]) {
            value = formData[tag.key];
          } else {
            return false;
          }
      }

      tag.value = value;
      return tag;
  }).filter( tag => (tag !== false) )

  return tags;

}

export default mapFormSchemaToTags;
