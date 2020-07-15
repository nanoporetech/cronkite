import numberScale from 'number-scale';
import { array, assert, number, object, tuple } from 'superstruct';
import { query } from '../workers/jmespath';

// tslint:disable: object-literal-sort-keys
numberScale.defineScale(
  'genome',
  {
    base: 1,
    k: 1e3,
    M: 1e6,
    G: 1e9,
    T: 1e12,
    P: 1e15,
    E: 1e18,
    Z: 1e21,
    Y: 1e24,
  },
  1,
);

numberScale.defineScale(
  'filesize',
  {
    '': 1024 ** 0,
    k: 1024 ** 1,
    M: 1024 ** 2,
    G: 1024 ** 3,
    T: 1024 ** 4,
    P: 1024 ** 5,
  },
  1,
);
// tslint:enable: object-literal-sort-keys

export const CoordinateTuple = tuple([number(), number()])
export const Coordinate = object({ x: number(), y: number() });
export const RawHistogram = array(CoordinateTuple);
export const Histogram = array(Coordinate);

export const debounce = (func: any, wait: number, immediate?: boolean) => {
  let timeout: any;
  return function (this: any) {
    // tslint:disable-next-line: no-this-assignment
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
};

export const uniqBy = (arr: any[], predicate: any) => {
  if (!Array.isArray(arr)) {
    return [];
  }
  const cb = typeof predicate === 'function' ? predicate : (o: any) => o[predicate];
  const pickedObjects = arr
    .filter(item => item)
    .reduce((map, item) => {
      const key = cb(item);
      if (!key) {
        return map;
      }
      return map.has(key) ? map : map.set(key, item);
    }, new Map())
    .values();
  return [...pickedObjects];
};

export const validateArray = (arrayIn: any) => {
  if (!Array.isArray(arrayIn)) return arrayIn;
  try {
    assert(arrayIn, RawHistogram);
    return arrayIn.map(([x, y]) => ({ x, y }));
  } catch (ignore) {
    // ignore
  }
  try {
    assert(arrayIn, Histogram);
    const arrayOut = Object.entries(
      arrayIn.reduce((mergedCoordinates, { x, y }) => {
        if (y === 0) return mergedCoordinates;
        const xDefined = mergedCoordinates[x];
        mergedCoordinates[x] = xDefined ? mergedCoordinates[x] + y : y;
        return mergedCoordinates;
      }, {}),
    ).map(coords => ({ x: +coords[0], y: coords[1] }));

    return arrayOut;
  } catch (ignore) {
    // ignore
  }
  return arrayIn;
};

export const transformValue = async (value: any, data: any): Promise<any> => {
  const isArrayValue = Array.isArray(value);
  if (typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || isArrayValue) {
    return isArrayValue ? value : [value];
  }
  return Promise.all(
    Object.entries(value).map(async ([func, val]) => {
      return applyFunction(func, val, data);
    }),
  );
};

export const applyFunction = async (func: string, val: any, data: any): Promise<any> => {
  let result;
  let arg;
  let precision: number;
  let unit;
  let dividend;
  let divisor;
  switch (func) {
    case 'fn:sum':
      result = (await transformValue(val, data))[0] || [];
      return result.reduce((a: number, b: number) => a + b, 0);
    case 'fn:divide':
      [dividend, divisor] = val;
      dividend = typeof dividend === 'number' ? dividend : (await transformValue(dividend, data))[0] || 0;
      divisor = typeof divisor === 'number' ? divisor : (await transformValue(divisor, data))[0] || 0;
      return dividend / divisor;
    case 'fn:mod':
      [dividend, divisor] = val;
      dividend = typeof dividend === 'number' ? dividend : (await transformValue(dividend, data))[0] || 0;
      divisor = typeof divisor === 'number' ? divisor : (await transformValue(divisor, data))[0] || 0;
      return dividend % divisor;
    case 'fn:formatNumber':
      [arg, precision, unit] = val;
      result = (await transformValue(arg, data))[0] || 0.0;
      const formattedNumber = numberScale(result, {
        precision,
        recursive: 0,
        scale: 'SI',
        unit: unit || '',
      });
      const hasOne = (/[\d\.]+/g.exec(formattedNumber) || [''])[0] === '1';
      return `${formattedNumber}${hasOne ? '' : 's'}`;
    case 'fn:toFixed':
      [arg, precision, unit] = val;
      result = (await transformValue(arg, data))[0] || 0.0;
      return `${Number.parseFloat(result).toFixed(precision)}${unit || ''}`;
    case 'fn:mode':
      [arg, precision] = val;
      result = (await transformValue(arg, data))[0] || 0.0;
      result = result
        .sort((a: number, b: number) => a - b)
        .reduce(
          (valueCount: { mode: number; modeCount: number }, newValue: any) => {
            const valueKey = Number.parseFloat(newValue).toFixed(precision);
            valueCount[valueKey] = (valueCount[valueKey] || 0) + 1;
            if (valueCount[valueKey] >= valueCount.modeCount) {
              valueCount.mode = newValue;
              valueCount.modeCount = valueCount[valueKey];
            }
            return valueCount;
          },
          { mode: 0, modeCount: 0 },
        );
      return result.mode;
    case 'fn:uniq':
      result = (await transformValue(val, data))[0] || [];
      return result.reduce((a: any, b: any) => {
        !a.includes(b) && a.push(b);
        return a;
      }, []);
    case 'fn:map':
      return Promise.all(
        val.map(async (v: { [param: string]: any }) => {
          return Object.assign(
            {},
            ...(await Promise.all(
              Object.entries(v).map(async ([mapKey, mapVal]) => {
                const returnVal = await transformValue(mapVal, data);
                return { [mapKey]: typeof returnVal === 'string' ? returnVal : returnVal[0] };
              }),
            )),
          );
        }),
      );
    case 'fn:round':
      return Math.round((await transformValue(val, data))[0] || 0);
    case 'fn:count':
      return (await transformValue(val, data))[0].length;
    case 'fn:average':
      const averages = (await transformValue(val, data))[0] || [];
      return averages.reduce((a: number, b: number) => a + b, 0) / (averages.length || 1);
    case 'fn:jmespath':
      // console.info('JMESPATH', val, data, await jmespath(val, data))
      return query(val, data);
    default:
      break;
  }
  return { [func]: val };
};

export const processValue = async (data: any, value: any) => {
  if (typeof value === 'string') return value;
  const [result] = await transformValue(value, data);
  if (Array.isArray(result)) {
    return validateArray(result);
  }
  if (typeof result === 'number') {
    return result.toLocaleString();
  }
  return result;
};

export const mapAttributesToProps = async (attributes: any, data: any) => {
  return Object.assign(
    {},
    ...(await Promise.all(
      Object.entries(attributes)
        .filter(([key]) => key.startsWith('@'))
        .map(async ([key, value]) => ({ [key.substr(1)]: await processValue(data, value) })),
    )),
  );
};
