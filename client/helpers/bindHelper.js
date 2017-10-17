function bindPublicMethod(target, key, value) {
  Object.defineProperty(target.prototype, key, bindMethod(target, key, {
    value,
    writable: true,
    enumerable: true,
    configurable: true
  }));
  return target;
}

function bindMethod(target, key, descriptor) {
  let fn = descriptor.value;
  let definingProperty = false;

  return {
    configurable: true,
    get() {
      if (definingProperty || this === target.prototype || this.hasOwnProperty(key)) {
        return fn;
      }
      let boundFn = fn.bind(this);
      definingProperty = true;
      Object.defineProperty(this, key, {
        value: boundFn,
        configurable: true,
        writable: true
      });
      definingProperty = false;
      return boundFn;
    }
  };
}

export { bindPublicMethod, bindMethod };
