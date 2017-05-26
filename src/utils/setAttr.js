
export function setEntityAttr(entity, key, update) {
  return Object.assign({}, entity, setAttr(entity[key], update));
}

export function deepSetEntityAttr(/* entity, keyPath, update */) {
  // const attr = get(entity, keyPath);
  const NOT_IMPLEMENTED_ERROR = {error: 'deepSetEntityAttr is not implemented yet!'};
  throw NOT_IMPLEMENTED_ERROR;
}

// Update works like React's setState
export function setAttr(attr, update) {
  return Object.assign({}, attr, update);
}

export default setAttr;
