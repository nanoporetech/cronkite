import JMESPath from 'jmespath';

// JMESPath.registerFunction(
//   'divide',
//   resolvedArgs => {
//     const [dividend, divisor] = resolvedArgs;
//     return dividend / divisor;
//   },
//   [{ types: [JMESPath.TYPE_NUMBER] }, { types: [JMESPath.TYPE_NUMBER] }],
// );

export const jmespath = async (path: string, json: any) => {
  return JMESPath.search(json, path);
};
