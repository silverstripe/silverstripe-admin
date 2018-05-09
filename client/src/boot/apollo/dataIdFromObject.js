const dataIdFromObject = (o) => {
  const dataId = o.id || o.ID;
  if (dataId && dataId >= 0 && o.__typename) {
    return `${o.__typename}:${dataId}`;
  }
  return null;
};

export default dataIdFromObject;
