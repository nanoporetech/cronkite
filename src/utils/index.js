import {struct} from 'superstruct';
import demoLayoutCTC from '../data/demo-ctc';
import demoLayoutQC from '../data/demo-qc';
import {pluckJMESPath} from '../workers/jsonpath.worker';

export const CoordinateTuple = struct(['number', 'number'])
export const Coordinate = struct({x: 'number', y: 'number'})
export const RawHistogram = struct([CoordinateTuple])
export const Histogram = struct([Coordinate])

export const validateArray = (arrayIn) => {
  try {
    RawHistogram(arrayIn);
    return arrayIn.map(([x, y]) => ({x, y}))
  } catch (ignore) {}
  try {
    Histogram(arrayIn);
    return arrayIn.reduce((mergedCoordinates, {x, y}) => {
      const previousCoordinate = mergedCoordinates.slice(-1)[0]
      if (previousCoordinate.x === x) {
        previousCoordinate.y = previousCoordinate.y + y
        return [...mergedCoordinates.slice(0, -1), previousCoordinate]
      }
      return [...mergedCoordinates, {x, y}]
    }, [
      {x: arrayIn[0].x, y:0}
    ])
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
  let result;
  switch (func) {
    case 'fn:sum':
      result = (await transformValue(val, data))[0] || []
      return result.reduce((a, b) => a + b, 0)
    case 'fn:tofixed':
      const [arg, decimals] = val
      result = (await transformValue(arg, data))[0] || 0.0
      return Number.parseFloat(result).toFixed(decimals)
    case 'fn:uniq':
      result = (await transformValue(val, data))[0] || []
      return result.reduce((a, b) => {!a.includes(b) && a.push(b); return a}, [])
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
      return Math.round((await transformValue(val, data))[0] || 0)
      // return (await transformValue(val, data))[0].reduce((a, b) => a + b, 0)
    case 'fn:count':

      return (await transformValue(val, data))[0].length
    case 'fn:average':
      const averages = (await transformValue(val, data))[0] || []
      return (averages.reduce((a, b) => a + b, 0)/(averages.length || 1))
    case 'fn:jmespath':
      // console.info('JMESPATH', val, data, await pluckJMESPath(val, data))
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
  const [result] = await transformValue(value, data)
  if (Array.isArray(result)) {
    return JSON.stringify(validateArray(result))
  }
  if (typeof result === 'number') {
    return result.toLocaleString()
  }
  return result
}


export const mapAttributesToProps = async (attributes, data) => {
  return Object.assign(
      {},
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