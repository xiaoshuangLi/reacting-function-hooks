export const isSameArray = (a = [], b = []) => {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((current, i) => {
    return a[i] === b[i];
  });
};

export const isPromise = (obj) => {
  return obj
    && typeof obj === 'object'
    && typeof obj.then === 'function';
};
