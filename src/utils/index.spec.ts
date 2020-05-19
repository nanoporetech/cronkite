import { applyFunction, mapAttributesToProps, validateArray } from './index';

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
};

describe('Dashboard utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('validates an array', () => {
    const symbol = Symbol('dummy');
    expect(validateArray([])).toStrictEqual([]);
    expect(validateArray({})).toStrictEqual({});
    expect(validateArray(true)).toStrictEqual(true);
    expect(validateArray('foo')).toStrictEqual('foo');
    expect(validateArray(null)).toStrictEqual(null);
    expect(validateArray(undefined)).toStrictEqual(undefined);
    expect(validateArray(symbol)).toStrictEqual(symbol);
    expect(validateArray(Infinity)).toStrictEqual(Infinity);
  });

  it('validates modifies tuples to coordinates', () => {
    expect(validateArray([[0, 1]])).toStrictEqual([{ x: 0, y: 1 }]);
    expect(
      validateArray([
        [0, 1],
        [1, 2],
      ]),
    ).toStrictEqual([
      { x: 0, y: 1 },
      { x: 1, y: 2 },
    ]);
    expect(
      validateArray([
        { x: 0, y: 1 },
        { x: 1, y: 2 },
      ]),
    ).toStrictEqual([
      { x: 0, y: 1 },
      { x: 1, y: 2 },
    ]);
  });

  it('maps HTML attributes to React props', async () => {
    // Load when there's nothing but ID given
    const mappedAttributes = await mapAttributesToProps(
      {
        '@hidden': [false],
        '@label': 'Dummy size',
        '@size': [666],
        '@value': [
          [
            [7, 3078],
            [7.1, 3144],
          ],
        ],
        ignored: 'THIS SHOULD BE IGNORED',
      },
      MOCK_PAYLOAD,
    );

    expect(mappedAttributes).toStrictEqual({
      hidden: false,
      label: 'Dummy size',
      size: '666',
      value: [
        { x: 7, y: 3078 },
        { x: 7.1, y: 3144 },
      ],
    });
  });

  it('applies the `sum` function', async () => {
    // Load when there's nothing but ID given
    const returnValue = await applyFunction('fn:sum', [[1, 2, 3, 4, 5, 6, 7]], MOCK_PAYLOAD);
    expect(returnValue).toStrictEqual(28);
  });

  it('applies the `formatNumber` function', async () => {
    // Load when there's nothing but ID given
    let returnValue = await applyFunction('fn:formatNumber', [[123456789.123456789], 2, 'base'], {});
    expect(returnValue).toStrictEqual('123.46Mbases');
    returnValue = await applyFunction('fn:formatNumber', [[123456789.123456789], 1, 'base'], {});
    expect(returnValue).toStrictEqual('123.5Mbases');
    returnValue = await applyFunction('fn:formatNumber', [[123456789.123456789], 0, 'base'], {});
    expect(returnValue).toStrictEqual('124Mbases');

    // Test singular
    returnValue = await applyFunction('fn:formatNumber', [[1000.1], 1, 'base'], {});
    expect(returnValue).toStrictEqual('1.1kbases');
    returnValue = await applyFunction('fn:formatNumber', [[1000.1], 0, 'base'], {});
    expect(returnValue).toStrictEqual('2kbases');
    returnValue = await applyFunction('fn:formatNumber', [[1000.0], 0, 'base'], {});
    expect(returnValue).toStrictEqual('1kbase');
    returnValue = await applyFunction('fn:formatNumber', [[1001], 1, 'base'], {});
    expect(returnValue).toStrictEqual('1.1kbases');
    returnValue = await applyFunction('fn:formatNumber', [[1e6], 0, 'base'], {});
    expect(returnValue).toStrictEqual('1Mbase');
  });

  it('applies the `tofixed` function', async () => {
    let returnValue = await applyFunction('fn:toFixed', [[123456789.123456789], 2], {});
    expect(returnValue).toStrictEqual('123456789.12');

    returnValue = await applyFunction('fn:toFixed', [[123456789.123456789], 4], {});
    expect(returnValue).toStrictEqual('123456789.1235');

    returnValue = await applyFunction('fn:toFixed', [[123456789.123456789], 4, '%'], {});
    expect(returnValue).toStrictEqual('123456789.1235%');
  });

  it('applies the `mode` function', async () => {
    // Calculate the most common value
    let returnValue = await applyFunction(
      'fn:mode',
      [[[-1, 2.21, -3.2, 4.2, 5.2, 2.2, 3.3, 4.11, 1.33, 5.1, 2.234, 3.2, 1.11, 5.67]], 1],
      {},
    );
    expect(returnValue).toStrictEqual(2.234);

    returnValue = await applyFunction('fn:jmespath', 'mode(@)', [
      -1,
      2.21,
      -3.2,
      4.2,
      5.2,
      2.21,
      3.3,
      4.11,
      1.33,
      5.1,
      2.21,
      3.2,
      1.11,
      5.67,
    ]);
    expect(returnValue).toStrictEqual([2.21]);
    returnValue = await applyFunction('fn:jmespath', 'mode(@)', []);
    expect(returnValue).toStrictEqual(null);
    returnValue = await applyFunction('fn:jmespath', 'mode(@)', [1, 2, 3]);
    expect(returnValue).toStrictEqual(null);
    returnValue = await applyFunction('fn:jmespath', 'mode(@)', [8, 9, 10, 10, 10, 11, 11, 11, 12, 13]);
    expect(returnValue).toStrictEqual([10, 11]);
  });

  it('applies the `median` function', async () => {
    // Calculate the most common value
    let returnValue = await applyFunction('fn:jmespath', 'median(@)', [
      -1,
      2.21,
      -3.2,
      4.2,
      5.2,
      2.21,
      3.3,
      4.11,
      1.33,
      5.1,
      2.21,
      3.2,
      1.11,
      5.67,
    ]);
    expect(returnValue).toStrictEqual(2.705);
    returnValue = await applyFunction('fn:jmespath', 'median(@)', []);
    expect(returnValue).toStrictEqual(null);
    returnValue = await applyFunction('fn:jmespath', 'median(@)', [2, 1, 3]);
    expect(returnValue).toStrictEqual(2);
    returnValue = await applyFunction('fn:jmespath', 'median(@)', [4, 2, 1, 3]);
    expect(returnValue).toStrictEqual(2.5);
    returnValue = await applyFunction('fn:jmespath', 'median(@)', [8, 9, 10, 10, 10, 11, 11, 11, 12, 13]);
    expect(returnValue).toStrictEqual(10.5);
  });

  it('applies the `mod` function', async () => {
    // Calculate the modulus of two numbers
    let returnValue = await applyFunction('fn:mod', [27, 2], {});
    expect(returnValue).toStrictEqual(1);
    returnValue = await applyFunction('fn:mod', [26, 2], {});
    expect(returnValue).toStrictEqual(0);
  });

  it('applies the `divide` function', async () => {
    // Divide two numerical values
    let returnValue = await applyFunction('fn:divide', [27, 2], {});
    expect(returnValue).toStrictEqual(13.5);
    returnValue = await applyFunction('fn:divide', [26, 2], {});
    expect(returnValue).toStrictEqual(13);
  });

  it('applies the `uniq` function', async () => {
    // Calculate the most common value
    let returnValue = await applyFunction('fn:uniq', [[1, 2, 4, 3, 2, 3, 4, 1, 2, 3, 2, 3, 3, 4, 2, 1]], {});
    expect(returnValue).toStrictEqual([1, 2, 4, 3]);

    returnValue = await applyFunction(
      'fn:uniq',
      [
        [
          'label-2',
          'label-4',
          'label-3',
          'label-2',
          'label-3',
          'label-4',
          'label-1',
          'label-2',
          'label-3',
          'label-2',
          'label-3',
          'label-3',
          'label-4',
          'label-2',
          'label-1',
        ],
      ],
      {},
    );
    expect(returnValue).toStrictEqual(['label-2', 'label-4', 'label-3', 'label-1']);
  });

  it('applies the `map` function', async () => {
    // Calculate the most common value
    const returnValue = await applyFunction('fn:map', [{ foobar: [1234] }, { Santa: ['Claws'] }], {});
    expect(returnValue).toStrictEqual([{ foobar: 1234 }, { Santa: 'Claws' }]);
  });

  it('applies the `round` function', async () => {
    // Calculate the most common value
    let returnValue = await applyFunction('fn:round', [[1.1]], {});
    expect(returnValue).toStrictEqual(1);
    returnValue = await applyFunction('fn:round', [[1.5]], {});
    expect(returnValue).toStrictEqual(2);
  });

  it('applies the `count` function', async () => {
    // Calculate the most common value
    const returnValue = await applyFunction('fn:count', [['a', 'b', 'c', 'd', 'e', 'f']], {});
    expect(returnValue).toStrictEqual(6);
  });

  it('applies the `average` function', async () => {
    // Calculate the most common value
    const returnValue = await applyFunction('fn:average', [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]], {});
    expect(returnValue).toStrictEqual(4.5);
  });

  it('applies the `mean` function', async () => {
    // Load when there's nothing but ID given
    const returnValue = await applyFunction('fn:jmespath', 'mean(@)', [13, 18, 13, 14, 13, 16, 14, 21, 13]);
    expect(returnValue).toStrictEqual(15);
  });

  it('handles nested functions', async () => {
    // Calculate the most common value
    const returnValue = await applyFunction(
      'fn:round',
      {
        'fn:average': [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]],
      },
      {},
    );
    expect(returnValue).toStrictEqual(5);
  });

  it('handles `unsupported` functions', async () => {
    // Calculate the most common value
    const returnValue = await applyFunction('fn:unsupported', [[0, 1, 2]], {});
    expect(returnValue).toStrictEqual({ 'fn:unsupported': [[0, 1, 2]] });
  });

  it('handles `flatMapValues` JMESPath function extension', async () => {
    // Calculate the most common value
    let returnValue = await applyFunction('fn:jmespath', 'flatMapValues(@)', { a: [1, 3, 5], b: [2, 4, 6] });
    expect(returnValue).toStrictEqual([
      ['a', 1],
      ['a', 3],
      ['a', 5],
      ['b', 2],
      ['b', 4],
      ['b', 6],
    ]);

    returnValue = await applyFunction('fn:jmespath', 'flatMapValues(@)', {
      a: [true, { x: 3 }, null, 1234, ['XXX']],
      b: { x: 2 },
    });
    expect(returnValue).toStrictEqual([
      ['a', true],
      ['a', { x: 3 }],
      ['a', null],
      ['a', 1234],
      ['a', ['XXX']],
      ['b', { x: 2 }],
    ]);

    returnValue = await applyFunction('fn:jmespath', 'flatMapValues(@)', [
      [1, 3, 5],
      [2, 4, 6],
    ]);
    expect(returnValue).toStrictEqual([
      ['0', 1],
      ['0', 3],
      ['0', 5],
      ['1', 2],
      ['1', 4],
      ['1', 6],
    ]);
  });
});
