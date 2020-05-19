import {
  registerFunction,
  search,
  TYPE_ARRAY,
  TYPE_ARRAY_NUMBER,
  TYPE_NUMBER,
  TYPE_OBJECT,
  TYPE_STRING,
} from '@metrichor/jmespath';
import numberScale from 'number-scale';

/*
  TODO:
    fn:round
    fn:mod
*/

registerFunction(
  'mean',
  ([vector]: [number[]]) => {
    return vector.reduce((a, b) => a + b, 0) / vector.length;
  },
  [{ types: [TYPE_ARRAY_NUMBER] }],
);

registerFunction(
  'mode',
  ([vector]: [number[]]) => {
    if (!vector.length) return null;
    const modeTracker = vector
      .sort((a: number, b: number) => a - b)
      .reduce((valueCount: { [mode: number]: [number, number] }, newValue: any) => {
        const valueKey = Number.parseFloat(newValue);
        valueCount[valueKey] = valueCount[valueKey]
          ? [valueCount[valueKey][0] + 1, valueCount[valueKey][1]]
          : [1, newValue];
        return valueCount;
      }, {});
    const maxOccurrence = Math.max(...Object.values(modeTracker).map(x => x[0]));
    if (maxOccurrence === 1 && vector.length > 1) {
      return null;
    }
    return Object.values(modeTracker)
      .filter(([occurrence]) => occurrence === maxOccurrence)
      .map(v => v[1]);
  },
  [{ types: [TYPE_ARRAY_NUMBER] }],
);

registerFunction(
  'median',
  ([vector]: [number[]]) => {
    if (!vector.length) return null;
    const sorted = vector.sort((a: number, b: number) => a - b);
    const halfway = vector.length / 2;
    if (vector.length % 2 === 0) {
      return (sorted[halfway - 1] + sorted[halfway]) / 2;
    }
    return sorted[Math.floor(halfway)];
  },
  [{ types: [TYPE_ARRAY_NUMBER] }],
);

registerFunction(
  'toFixed',
  ([toFormat, precision]) => {
    return `${Number.parseFloat(toFormat || 0.0).toFixed(precision)}`;
  },
  [{ types: [TYPE_NUMBER] }, { types: [TYPE_NUMBER] }],
);

registerFunction(
  'formatNumber',
  ([toFormat, precision, unit]) => {
    const formattedNumber = numberScale(toFormat || 0.0, {
      precision,
      recursive: 0,
      scale: 'SI',
      unit: unit || '',
    });
    const hasOne = (/[\d\.]+/g.exec(formattedNumber) || [''])[0] === '1';
    return `${formattedNumber}${hasOne ? '' : 's'}`;
  },
  [{ types: [TYPE_NUMBER] }, { types: [TYPE_NUMBER] }, { types: [TYPE_STRING] }],
);

registerFunction(
  'uniq',
  ([resolvedArgs]) => {
    return Array.from(new Set<any>(resolvedArgs));
  },
  [{ types: [TYPE_ARRAY] }],
);

registerFunction(
  'divide',
  resolvedArgs => {
    const [dividend, divisor] = resolvedArgs;
    return dividend / divisor;
  },
  [{ types: [TYPE_NUMBER] }, { types: [TYPE_NUMBER] }],
);

registerFunction(
  'split',
  ([splitChar, toSplit]) => {
    return toSplit.split(splitChar);
  },
  [{ types: [TYPE_STRING] }, { types: [TYPE_STRING] }],
);

registerFunction(
  'entries',
  ([resolvedArgs]) => {
    return Object.entries(resolvedArgs);
  },
  [{ types: [TYPE_OBJECT, TYPE_ARRAY] }],
);

registerFunction(
  'format',
  ([template, templateStringsMap]) => {
    let newTemplate = template;
    for (const attr in templateStringsMap) {
      const rgx = new RegExp(`\\$\\{${attr}\\}`, 'g');
      newTemplate = newTemplate.replace(rgx, templateStringsMap[attr] ?? '');
    }
    return newTemplate;
  },
  [{ types: [TYPE_STRING] }, { types: [TYPE_OBJECT, TYPE_ARRAY] }],
);

registerFunction(
  'flatMapValues',
  ([inputObject]) => {
    return Object.entries(inputObject).reduce((flattened, entry) => {
      const [key, value]: [string, any] = entry;

      if (Array.isArray(value)) {
        return [...flattened, ...value.map(v => [key, v])];
      }
      return [...flattened, [key, value]];
    }, [] as any[]);
  },
  [{ types: [TYPE_OBJECT, TYPE_ARRAY] }],
);

export const query = async (path: string, json: any) => {
  return search(json, path);
};
