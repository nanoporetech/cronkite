import { registerFunction, search, TYPE_ARRAY, TYPE_NUMBER, TYPE_OBJECT, TYPE_STRING } from '@metrichor/jmespath';
import numberScale from 'number-scale';

/*
  TODO:
    fn:round
    fn:average
    fn:mode
    fn:mod
*/

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

export const query = async (path: string, json: any) => {
  return search(json, path);
};
