import {DataObject} from "../../types/DataObject";

const dataIdFromObject = (o: DataObject): string|null => {
  const dataId = o.id || o.ID;
  if (dataId && dataId >= 0 && o.__typename) {
    return `${o.__typename}:${dataId}`;
  }
  return null;
};

export default dataIdFromObject;
