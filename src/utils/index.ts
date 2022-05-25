import { numberScale } from '@metrichor/jmespath-plus';
import Ajv from 'ajv';
import {
  asStruct,
  Dictionary,
  isDefined,
  isIndex,
  isString,
  JSONValue,
  UnknownFunction,
  isUnion,
  isArray,
  isDictionary,
  asString,
  asArrayOf,
  asNumber,
} from 'ts-runtime-typecheck';

import { FunctionTag, PropTag, ReportDefinition, TransformFn } from '..';

import reportSchema from '../cronkite.schema.json';
import { query } from '../workers/jmespath.worker';
import { ComponentConfig, Stream } from '../types/reportconfig.type';

export const jmespathTransform = {
  'fn:jmespath': isString,
};

export const isFunctionTransform = (value: unknown): value is TransformFn =>
  isDictionary(value) && Object.keys(value).every(k => k.startsWith('fn:'));

export const isNonEmptyConfigArray = (value: unknown): value is ComponentConfig[] => isArray(value);
export const isNonEmptyStreamArray = (value: unknown): value is Stream[] => isArray(value);

const reportDefinition = {
  id: isIndex,
  components: isNonEmptyConfigArray,
  streams: isNonEmptyStreamArray,
};

const asReportDefinition = asStruct(reportDefinition);

// export function CoordinateTuple(value: unknown): boolean {
//   return Array.isArray(value) && value.length === 2 && value.every(c => typeof c === 'number');
// }

// export function Coordinate(value: unknown): boolean {
//   return value instanceof Object && 'x' in value && 'y' in value;
// }

export function debounce(func: UnknownFunction, wait: number, immediate?: boolean): (...args: unknown[]) => void {
  let timeout: NodeJS.Timeout;
  return function (...args: unknown[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) func(...args);
    }, wait);
    if (immediate && timeout !== undefined) func(...args);
  };
}

export function uniqBy<T = Dictionary>(arr: T[], predicate: UnknownFunction | string): T[] {
  if (!Array.isArray(arr)) {
    return [];
  }
  const cb = typeof predicate === 'function' ? predicate : (o: T) => o[predicate];
  const pickedObjects = arr
    .filter(item => item)
    .reduce((map, item) => {
      const key = cb(item);
      if (!isDefined(key)) {
        return map;
      }
      return map.has(key) ? map : map.set(key, item);
    }, new Map())
    .values();
  return Array.from(pickedObjects);
}

/**
 * TODO: Might want to convert this into a supported Cronkite function
 * like `fn:asCoordinates` and `fn:asCoordinateTuple` where:
 * - `fn:asCoordinates` -> {x:number, y: number}[]
 * - `fn:asCoordinateTuple` -> [number, number][]
 *
 * Graphs usually require one or the other form of coordinates as input
 *
 */

// export function validateArray(arrayIn: unknown) {
//   if (!Array.isArray(arrayIn)) {
//     return arrayIn;
//   }
//   if (arrayIn.slice(0, 10).every(CoordinateTuple)) {
//     return arrayIn.map(([x, y]) => ({ x, y }));
//   }
//   if (arrayIn.slice(0, 10).every(Coordinate)) {
//     const arrayOut = Object.entries(
//       arrayIn.reduce((mergedCoordinates, { x, y }) => {
//         if (y === 0) {
//           return mergedCoordinates;
//         }
//         const xDefined = mergedCoordinates[x];
//         mergedCoordinates[x] = xDefined ? mergedCoordinates[x] + y : y;
//         return mergedCoordinates;
//       }, {}),
//     ).map(coords => ({ x: +coords[0], y: coords[1] }));
//     return arrayOut;
//   }
//   return arrayIn;
// }

export async function transformValue(value: JSONValue | TransformFn, json: JSONValue = null): Promise<JSONValue> {
  if (!isFunctionTransform(value)) {
    return value;
  }
  const transforms = Object.entries(value);
  return Promise.all(
    transforms.map(async ([func, val]: [FunctionTag, JSONValue]) => {
      return applyFunction(func, val, json);
    }),
  ).then(result => (transforms.length === 1 ? result[0] : result));
}

export async function applyFunction(
  func: FunctionTag,
  val: JSONValue | JSONValue[],
  data: JSONValue = null,
): Promise<JSONValue> {
  let arg;
  let precision;
  let unit;
  let formattedNumber: string | string[];
  let hasOne: boolean;
  switch (func) {
    case 'fn:formatNumber':
      [arg, precision, unit] = asArrayOf(isUnion(isIndex, isFunctionTransform))(val);
      unit = asString(unit, '');
      precision = asNumber(precision, 0);
      arg = isFunctionTransform(arg) ? await transformValue(arg, data) : asNumber(arg);
      formattedNumber = numberScale(asNumber(arg, 0), {
        precision,
        recursive: 0,
        scale: 'SI',
        unit: unit ?? '',
      });
      formattedNumber = isArray(formattedNumber) ? formattedNumber[0] : formattedNumber;
      hasOne = (/[\d.]+/g.exec(asString(formattedNumber)) || [''])[0] === '1';
      return `${formattedNumber}${hasOne || !unit ? '' : 's'}`;
    case 'fn:jmespath':
      return query(asString(val), data);
    default:
      break;
  }
  return null;
}

export async function processValue(data: JSONValue = null, value: JSONValue = null) {
  if (!isFunctionTransform(value)) {
    return value;
  }

  const result = await transformValue(value, data);
  // if (Array.isArray(result)) {
  //   return validateArray(result);
  // }
  // if (typeof result === 'number') {
  //   return result.toLocaleString();
  // }
  return result;
}

export function filterProps(attributes: Dictionary<unknown>): Record<PropTag, JSONValue> {
  return {
    ...Object.entries(attributes)
      .filter(([attr]) => attr.startsWith('@') && attr.length > 2)
      .reduce((props, [attr, val]) => ({ ...props, [attr.substr(1)]: val }), {}),
  };
}

export async function mapAttributesToProps(attributes: Dictionary<JSONValue>, data: JSONValue = null) {
  return Object.assign(
    {},
    ...(await Promise.all(
      Object.entries(attributes)
        .filter(([key]) => key.startsWith('@'))
        .map(async ([key, value]) => ({ [key.substr(1)]: await processValue(data, value) })),
    )),
  );
}

const ajv = new Ajv({ allowUnionTypes: true, strictTuples: false });

export function validateCronkiteJSONSchema(configIn: unknown): { isValidSchema: boolean; schemaErrors: string | null } {
  const isValidSchema = ajv.validate(reportSchema, configIn);
  const schemaErrors = isValidSchema ? null : JSON.stringify(ajv.errors, null, 2);
  return { isValidSchema, schemaErrors };
}

export function coerceCronkiteConfig(config: ReportDefinition | string, validate = true): ReportDefinition {
  const reportDefinition: JSONValue = isString(config) ? JSON.parse(asString(config)) : config;

  if (validate) {
    const { isValidSchema, schemaErrors } = validateCronkiteJSONSchema(reportDefinition);
    if (!isValidSchema) {
      throw new Error(schemaErrors);
    }
  }
  return asReportDefinition(reportDefinition);
}
