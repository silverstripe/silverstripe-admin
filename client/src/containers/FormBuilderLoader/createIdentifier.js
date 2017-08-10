const createIdentifier = (props) => {
  const { identifier, schema } = props;
  return [
    identifier,
    schema && schema.schema && schema.schema.name,
  ].filter(id => id).join('.');
};

export default createIdentifier;