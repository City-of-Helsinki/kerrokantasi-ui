import getAttr from '../src/utils/getAttr';

describe('getAttr', () => {
  const FI = 'fi';
  const SV = 'sv';
  const EN = 'en';
  const str = 'foobar';
  const onlySV = {'sv': 'foobar'};
  const all = {
    [FI]: str,
    [SV]: SV,
    [EN]: EN
  };

  it('should return non-objects unmutatted without `exact` mode', () => {
    expect(getAttr(str, FI)).toBe(str);
    expect(getAttr('', FI)).toBe('');
    expect(getAttr(123, FI)).toBe(123);
    expect(getAttr(0, FI)).toBe(0);
    expect(getAttr(undefined, FI)).toBeUndefined();
    expect(getAttr([], FI)).toEqual([]);
  });

  it('`dev` option should append language code to output', () => {
    expect(getAttr(str, FI, {dev: true})).toMatch(FI);
    expect(getAttr('', FI, {dev: true})).toMatch(FI);
    expect(getAttr(123, FI, {dev: true})).toMatch(FI);
    expect(getAttr(0, FI, {dev: true})).toMatch(FI);
    expect(getAttr(undefined, FI, {dev: true})).toMatch(FI);
    expect(getAttr([], FI, {dev: true})).toMatch(FI);
  });

  it('should translate to correct lng', () =>
    expect(getAttr(all, FI)).toBe(str)
  );

  it('should translate to correct lng with `exact`', () =>
    expect(getAttr(all, FI, {exact: true})).toBe(str)
  );

  it('should return some translation when exact translation is not available', () => {
    expect(getAttr(onlySV, FI)).toBe('foobar');
  });

  it('should return undefined with `exact` option when exact translation is not available', () => {
    expect(getAttr(onlySV, FI, {exact: true})).toBeUndefined();
    expect(getAttr(str, FI, {exact: true})).toBeUndefined();
    expect(getAttr('', FI, {exact: true})).toBeUndefined();
    expect(getAttr(123, FI, {exact: true})).toBeUndefined();
    expect(getAttr(0, FI, {exact: true})).toBeUndefined();
    expect(getAttr(undefined, FI, {exact: true})).toBeUndefined();
    expect(getAttr([], FI, {exact: true})).toBeUndefined();
  });
});
