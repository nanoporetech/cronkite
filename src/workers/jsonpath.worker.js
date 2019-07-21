import jmespath from 'jmespath';

export function pluckJMESPath(path, json) {
    return jmespath.search(json, path);
}