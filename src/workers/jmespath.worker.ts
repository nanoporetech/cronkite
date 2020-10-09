import jmespath, { TreeInterpreter } from '@metrichor/jmespath-plus';
import { JSONValue } from '../types/json.type';

const EXPRESSION_CACHE = {};
export const query = async (path: string, json: JSONValue): Promise<JSONValue> => {
  if (!(path in EXPRESSION_CACHE)) {
    EXPRESSION_CACHE[path] = jmespath.compile(path);
  }
  return TreeInterpreter.search(EXPRESSION_CACHE[path], json);
};
