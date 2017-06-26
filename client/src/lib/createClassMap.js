const createClassMap = (classesStr) => {
  const classConfig = {};
  if (classesStr) {
    classesStr.split(' ').forEach(className => {
      if (className !== '') {
        classConfig[className] = true;
      }
    });
  }
  return classConfig;
};

export default createClassMap;
