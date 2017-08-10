/**
 * Creates a dot-separated identifier for forms generated
 * with schemas (e.g. FormBuilderLoader)
 *
 * @param props
 * @returns {string}
 */
const createIdentifier = (props) => {
  const { identifier, schema } = props;
  return [
    identifier,
    schema && schema.schema && schema.schema.name,
  ].filter(id => id).join('.');
};

export default createIdentifier;
