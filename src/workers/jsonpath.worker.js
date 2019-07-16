import jmespath from 'jmespath';

export function pluckJMESPath(path, json) {
    const result = jmespath.search(json, path);
    return result
}