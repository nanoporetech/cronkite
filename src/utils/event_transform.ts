export function eventAsJSON(event: Event | CustomEvent) {
  const obj = {};
  for (const key in event) {
    if (typeof event[key] === 'string' || typeof event[key] === 'number' || typeof event[key] === 'boolean') {
      obj[key] = event[key];
    }
  }
  return obj;
}


