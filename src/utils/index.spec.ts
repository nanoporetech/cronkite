import {
  isFunctionTransform,
  transformValue,
  applyFunction,
  mapAttributesToProps,
  // validateArray,
  uniqBy,
  filterProps,
} from './index';

const MOCK_PAYLOAD = {
  data: [
    {
      barcode: 'BC01',
      count: 377356,
      exit_status: 'Workflow successful',
      mean_qscore: {
        avg: 10.479834774059508,
        bin_size: 0.1,
        hist: [
          [7, 3078],
          [7.1, 3144],
        ],
        total: 3954628.531,
      },
      run_id: 'aee483b82daa6330c2fcf925f3c3cd7b59ee1e93',
      start_time: '12',
    },
  ],
  nums: [26, 27, 1.2, 1.5],
};

describe('isFunctionTransform', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Detects function transforms', () => {
    expect(isFunctionTransform('I am a string')).toBeFalsy();
    expect(isFunctionTransform(1234)).toBeFalsy();
    expect(isFunctionTransform(null)).toBeFalsy();
    expect(isFunctionTransform(true)).toBeFalsy();
    expect(isFunctionTransform([1, 2, 3, 4])).toBeFalsy();
    expect(isFunctionTransform({ foo: 'bar' })).toBeFalsy();
    expect(isFunctionTransform({ 'fn:unknown': 'bar', test: 1234 })).toBeFalsy();
    expect(isFunctionTransform([{ 'fn:unknown': 'bar' }, { 'fn:other': 'bar' }])).toBeFalsy();
    expect(isFunctionTransform({ 'fn:unknown': 'bar', 'fn:other': 1234 })).toBeTruthy();
    expect(isFunctionTransform({ 'fn:unknown': 'bar' })).toBeTruthy();
  });
});

describe('uniqBy', () => {
  it('Re-organises array on the basis of property or predicate', () => {
    expect(uniqBy(null, 'foo')).toStrictEqual([]);
    expect(uniqBy(['one', 'two', 'three', 'nine'], 'length')).toStrictEqual(['one', 'three', 'nine']);
    expect(
      uniqBy(
        [
          {
            label: 'one',
            value: 1,
          },
          {
            label: 'two',
            value: 2,
          },
          {
            label: 'one',
            value: 100,
          },
        ],
        'label',
      ),
    ).toStrictEqual([
      {
        label: 'one',
        value: 1,
      },
      {
        label: 'two',
        value: 2,
      },
    ]);
    expect(
      uniqBy(
        [
          {
            label: 'one',
            value: 1,
          },
          {
            label: 'two',
            value: 2,
          },
          {
            label: 'ninety-nine',
            value: 99,
          },
        ],
        (x: { value: number }) => x.value % 3 === 0,
      ),
    ).toStrictEqual([
      {
        label: 'one',
        value: 1,
      },
      {
        label: 'ninety-nine',
        value: 99,
      },
    ]);
  });
});

describe('transformValue', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Transforms values as expected', async () => {
    expect(await transformValue('I am a string')).toStrictEqual('I am a string');
    expect(await transformValue(1234)).toStrictEqual(1234);
    expect(await transformValue(null)).toStrictEqual(null);
    expect(await transformValue(true)).toStrictEqual(true);
    expect(await transformValue([1, 2, 3, 4])).toStrictEqual([1, 2, 3, 4]);
    expect(await transformValue({ foo: 'bar' })).toStrictEqual({ foo: 'bar' });
    expect(await transformValue({ 'fn:unknown': 'bar', test: 1234 })).toStrictEqual({
      'fn:unknown': 'bar',
      test: 1234,
    });
    expect(await transformValue([{ 'fn:unknown': 'bar' }, { 'fn:other': 'bar' }])).toStrictEqual([
      { 'fn:unknown': 'bar' },
      { 'fn:other': 'bar' },
    ]);
    expect(await transformValue({ 'fn:unknown': 'bar', 'fn:other': 1234 })).toStrictEqual([null, null]);
    expect(await transformValue({ 'fn:unknown': 'bar' })).toStrictEqual(null);
    expect(await transformValue({ 'fn:jmespath': '[data[0].barcode, data[].count]' }, MOCK_PAYLOAD)).toStrictEqual([
      'BC01',
      [377356],
    ]);
    expect(
      await transformValue(
        {
          'fn:jmespath': '[data[0].barcode, data[].count]',
          'fn:formatNumber': [{ 'fn:jmespath': 'data[0].mean_qscore.avg' }, 2, 'foo'],
        },
        MOCK_PAYLOAD,
      ),
    ).toStrictEqual([['BC01', [377356]], '10.48 foos']);
  });
});

describe('Dashboard utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("Doesn't transform JSON primitives", async () => {
    expect(await transformValue('I am a string')).toStrictEqual('I am a string');
    expect(await transformValue(false)).toStrictEqual(false);
    expect(await transformValue(1234)).toStrictEqual(1234);
    expect(await transformValue({ foo: 1234 })).toStrictEqual({ foo: 1234 });
    expect(await transformValue([1, 2, 3, 4])).toStrictEqual([1, 2, 3, 4]);
    expect(await transformValue(null)).toStrictEqual(null);
  });

  // it('validates an array', () => {
  //   const symbol = Symbol('dummy');
  //   expect(validateArray([])).toStrictEqual([]);
  //   expect(validateArray({})).toStrictEqual({});
  //   expect(validateArray(true)).toStrictEqual(true);
  //   expect(validateArray('foo')).toStrictEqual('foo');
  //   expect(validateArray(null)).toStrictEqual(null);
  //   expect(validateArray(undefined)).toStrictEqual(undefined);
  //   expect(validateArray(symbol)).toStrictEqual(symbol);
  //   expect(validateArray(Infinity)).toStrictEqual(Infinity);
  // });

  // it('validates modifies tuples to coordinates', () => {
  //   expect(validateArray([[0, 1]])).toStrictEqual([{ x: 0, y: 1 }]);
  //   expect(
  //     validateArray([
  //       [0, 1],
  //       [1, 2],
  //     ]),
  //   ).toStrictEqual([
  //     { x: 0, y: 1 },
  //     { x: 1, y: 2 },
  //   ]);
  //   expect(
  //     validateArray([
  //       { x: 0, y: 1 },
  //       { x: 1, y: 2 },
  //     ]),
  //   ).toStrictEqual([
  //     { x: 0, y: 1 },
  //     { x: 1, y: 2 },
  //   ]);
  // });

  it('maps HTML attributes to React props', async () => {
    // Load when there's nothing but ID given
    const mappedAttributes = await mapAttributesToProps(
      {
        '@hidden': [false],
        '@available': true,
        '@label': 'Dummy size',
        '@sizes': [666, 777, 888],
        '@foo': null,
        '@bar': 1234,
        '@value': [
          [7, 3078],
          [7.1, 3144],
        ],
        '@test': {
          'fn:jmespath': 'data[].barcode',
        },
        ignored: 'THIS SHOULD BE IGNORED',
      },
      MOCK_PAYLOAD,
    );

    expect(mappedAttributes).toStrictEqual({
      hidden: [false],
      available: true,
      label: 'Dummy size',
      sizes: [666, 777, 888],
      foo: null,
      bar: 1234,
      value: [
        [7, 3078],
        [7.1, 3144],
      ],
      test: ['BC01'],
    });
  });

  it('applies the `formatNumber` function', async () => {
    // Load when there's nothing but ID given
    let returnValue = await applyFunction('fn:formatNumber', [123456789.12345678, 2, `base`]);
    expect(returnValue).toStrictEqual('123.46 Mbases');
    returnValue = await applyFunction('fn:formatNumber', [123456789.12345678, 1, `base`]);
    expect(returnValue).toStrictEqual('123.5 Mbases');
    returnValue = await applyFunction('fn:formatNumber', [123456789.12345678, 1, ``]);
    expect(returnValue).toStrictEqual('123.5 M');
    returnValue = await applyFunction('fn:formatNumber', [123.45, 1, ``]);
    expect(returnValue).toStrictEqual('123.5');
    returnValue = await applyFunction('fn:formatNumber', [123.45, 1, `base`]);
    expect(returnValue).toStrictEqual('123.5 bases');
    returnValue = await applyFunction('fn:formatNumber', [123456789.12345678, 0, `base`]);
    expect(returnValue).toStrictEqual('124 Mbases');
    returnValue = await applyFunction('fn:formatNumber', [0, 2, ``]);
    expect(returnValue).toStrictEqual('0');
    returnValue = await applyFunction('fn:formatNumber', [NaN, 2, ``]);
    expect(returnValue).toStrictEqual('0');
    returnValue = await applyFunction('fn:formatNumber', [0, 2, `foo`]);
    expect(returnValue).toStrictEqual('0 foos');
    returnValue = await applyFunction('fn:formatNumber', [NaN, 2, `foo`]);
    expect(returnValue).toStrictEqual('0 foos');

    // Test singular
    returnValue = await applyFunction('fn:formatNumber', [1000.1, 1, 'base']);
    expect(returnValue).toStrictEqual('1.1 kbases');
    returnValue = await applyFunction('fn:formatNumber', [1000.1, 0, 'base']);
    expect(returnValue).toStrictEqual('2 kbases');
    returnValue = await applyFunction('fn:formatNumber', [1000.0, 0, 'base']);
    expect(returnValue).toStrictEqual('1 kbase');
    returnValue = await applyFunction('fn:formatNumber', [1001, 1, 'base']);
    expect(returnValue).toStrictEqual('1.1 kbases');
    returnValue = await applyFunction('fn:formatNumber', [1e6, 0, 'base']);
    expect(returnValue).toStrictEqual('1 Mbase');

    // Test transformFunction

    returnValue = await applyFunction('fn:formatNumber', [
      {
        'fn:jmespath': '`123.45`',
      },
      1,
      `base`,
    ]);
    expect(returnValue).toStrictEqual('123.5 bases');
  });

  it('handles `unsupported` functions', async () => {
    // Calculate the most common value
    const returnValue = await applyFunction('fn:unsupported', [0, 1, 2]);
    expect(returnValue).toStrictEqual(null);
  });
});

describe('filterProps', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Filters props from attributes', () => {
    expect(
      filterProps({
        foo: 1,
        '@bar': 2,
        '@': 3,
        'bun@dy': 4,
      }),
    ).toStrictEqual({
      bar: 2,
    });
  });
});
