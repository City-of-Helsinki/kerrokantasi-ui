export function deepSetEntityAttr(/* entity, keyPath, update */) {
  // const attr = get(entity, keyPath);
  throw new Error({ error: 'deepSetEntityAttr is not implemented yet!' });
}

// Update works like React's setState
export function setAttr(attr, update) {
  return { ...attr, ...update };
}

export function setEntityAttr(entity, key, update) {
  return { ...entity, ...setAttr(entity[key], update) };
}

export default setAttr;
