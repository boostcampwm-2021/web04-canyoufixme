const runner = (code, setter) => {
  const setupCode = `
    const expect = function (expected) {
      return {
        toBe(value) {
          if (expected !== value)
            throw new Error('expected !== value');
        }
      };
    };
  `;
  const testCode = `
    expect(getTypeName({})).toBe('object');
    expect(getTypeName([])).toBe('array');
  `;
  try {
    const codeRunner = new Function(`
      ${setupCode}
      ${code}
      ${testCode}
    `);
    codeRunner();
  } catch (e) {
    setter(`${e.toString()}`);
    return false;
  }
  return true;
};

export default runner;
