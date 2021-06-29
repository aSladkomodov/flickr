function mapping(config, values, callback) {
  if (
    typeof config.mapping !== "string" &&
    typeof config.callback === "function"
  ) {
    return mapping(config.mapping, values, config.callback);
  }

  const keys = Object.keys(config);
  let result;
  let keyFrom;
  let keyTo;
  const cb2 = (val) => callback(keyFrom, val);

  for (const element of keys) {
    keyFrom = element;
    keyTo = config[element];
    result = mapPath(values, result, keyFrom, keyTo, cb2);
  }

  return result;
}

export default mapping;

function mapPath(from, to, pathFrom, pathTo, cb) {
  let res = to;

  // if there is no such path in the source object, we return
  // or invalid path
  if (from === undefined || typeof pathTo !== "string") {
    return res;
  }

  // get the value: go down as deep as possible - to the first array
  const posArrayFrom = pathFrom.indexOf("[]");
  const posArrayTo = pathTo.indexOf("[]");

  // eslint-disable-next-line max-len
  if (
    posArrayFrom !== posArrayTo &&
    (posArrayFrom === -1 || posArrayTo === -1)
  ) {
    // invalid mapping: array to non-array, or non-array to an array
    return res;
  }

  const keysFrom =
    posArrayFrom === -1
      ? pathFrom.split(".")
      : pathFrom.slice(0, posArrayFrom).split(".");
  let val = from;

  for (const key of keysFrom) {
    if (!key) {
      continue;
    }

    val = val[key];

    // no such path in the original object
    if (val === undefined) {
      return res;
    }
  }

  // boundary case 1: move a value from an object into an array
  // (from[].prop -> to[])
  if (!pathTo) {
    return cb ? cb(val) : val;
  }

  // move the value to the first array,
  // or deeper everything will be moved by recursion below
  const keysTo =
    posArrayTo === -1
      ? pathTo.split(".")
      : pathTo.slice(0, posArrayTo).split(".");

  res = res || {};

  let node = res;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < keysTo.length - 1; i++) {
    const key = keysTo[i];

    node[key] = node[key] || {};
    node = node[key];
  }

  const keyToLast = keysTo[keysTo.length - 1];

  // if there are arrays in mapping — run recursion
  if (posArrayFrom !== -1) {
    val = iterate(
      val,
      node[keyToLast],
      pathFrom.slice(posArrayFrom + 3),
      pathTo.slice(posArrayTo + 3),
      cb
    );
  }

  // boundary case 2: mapping is needed for the array, not for an object
  // (from[].prop -> [])
  if (posArrayTo === 0) {
    return val;
  }

  node[keyToLast] = cb && posArrayTo === -1 ? cb(val) : val;

  return res;
}

function iterate(from, to, pathFrom, pathTo, cb) {
  let res = to;

  if (!Array.isArray(from)) {
    return res;
  }

  res = res || [];

  let hasValues;

  for (let i = 0; i < from.length; i++) {
    const v = mapPath(from[i], res[i], pathFrom, pathTo, cb);

    if (v !== undefined) {
      hasValues = true;
    }

    res[i] = v;
  }

  return hasValues ? res : to;
}
