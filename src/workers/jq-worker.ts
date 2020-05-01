import jq from 'jq-web';
import debounce from 'lodash/debounce';

const debouncedSearch = debounce((data: any, path: string, resolve: any) => {
  debouncedSearch.cancel();
  resolve(jq.json(data, path))
}, 0, { trailing: true })

export const jqSearch = (data: any, path: string) => {
  return new Promise(resolve => {
    debouncedSearch(data, path, resolve)
  })
};
