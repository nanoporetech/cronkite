import { compile, TreeInterpreter } from '@metrichor/jmespath-plus';

const EXPRESSION_CACHE = {};
export const query = async (path: string, json: any) => {
  if (!(path in EXPRESSION_CACHE)) {
    EXPRESSION_CACHE[path] = compile(path);
  }
  return TreeInterpreter.search(EXPRESSION_CACHE[path], json);
};
