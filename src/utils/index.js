import {struct} from 'superstruct';
import demoLayoutCTC from '../data/demo-ctc';
import demoLayoutQC from '../data/demo-qc';
import {pluckJMESPath} from '../workers/jsonpath.worker';

export const Coordinate = struct(['number', 'number'])
export const Histogram = struct([Coordinate])

export const validateValue = (arrayIn) => {
  try {
    Histogram(arrayIn);
    return arrayIn.map(([x, y]) => ({x, y}))
  } catch (ignore) {}
  return arrayIn
}


const transformValue = async (value, data) => {
  if (typeof value === 'string' || Array.isArray(value)) return value
  return await Promise.all(Object.entries(value).map(async ([func, val]) => {
    return await applyFunction(func, val, data)
  }))
}

const applyFunction = async (func, val, data) => {
  // console.info('In applyFunction', func, val);
  let result;
  switch (func) {
    case 'fn:sum':
      result = (await transformValue(val, data))[0] || []
      return result.reduce((a, b) => a + b, 0)
    case 'fn:map':
      return await Promise.all(val.map(
        async (v) => {
          return (
            Object.assign(
              {},
              ...(await Promise.all(
                Object
                .entries(v)
                .map(
                  async ([mapKey, mapVal]) => {
                    const returnVal = await transformValue(mapVal, data)
                    return {[mapKey]: typeof returnVal === 'string' ? returnVal : returnVal[0]}
                  }
                )
              ))
            )
          )
        }
      ))
    case 'fn:round':
      return Math.round((await transformValue(val, data))[0])
      // return (await transformValue(val, data))[0].reduce((a, b) => a + b, 0)
    case 'fn:count':

      return (await transformValue(val, data))[0].length
    case 'fn:average':
      const averages = (await transformValue(val, data))[0]
      return (averages.reduce((a, b) => a + b, 0)/averages.length)
    case 'fn:jmespath':
      // console.info('JMESPATH QUERY!!', val, await pluckJMESPath(val, data));// JSONPath({path: val, json: data, wrap: false});
      return await pluckJMESPath(val, data);
    default:
      break;
  }
  return {[func]: val}
}

export const loadReportLayout = (idInstance, demoType) => {
    const localLayout = localStorage.getItem(`epi-workflowlayout:${idInstance}`)
    return (localLayout && JSON.parse(localLayout)) || demoType === 'qc' ? demoLayoutQC : demoLayoutCTC;
}

export const saveReportLayout = (idInstance, layout) => {
    localStorage.setItem(`epi-workflowlayout:${idInstance}`, JSON.stringify(layout))
}

export const processValue = async (data, value) => {
  if (typeof value === 'string') return value;
  const result = await transformValue(value, data)
  return JSON.stringify(Array.isArray(result) ? validateValue(result[0]) : validateValue(result));
}


export const mapAttributesToProps = async (attributes, data) => {
  return Object.assign(
      ...await Promise.all(
      Object.entries(attributes)
        .filter(([key]) => key.startsWith('@'))
        .map(async ([key, value]) => (
          {[key.substr(1)]: await processValue(data, value)}
        )
      )
    )
  )
}