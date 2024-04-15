export const areArraysOfObjectsEqual = (array1, array2) => {
  if (array1.length !== array2.length) {
    return false;
  }

  const isObjectEqual = (obj1, obj2) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    return keys1.every((key) => obj1[key] === obj2[key]);
  };

  return array1.every((obj1, i) => isObjectEqual(obj1, array2[i]));
};

export const formatCustomDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}`;
};
