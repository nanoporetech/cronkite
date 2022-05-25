import { JSONValue, isPrimitive } from 'ts-runtime-typecheck';

export function normaliseEvent(event: Event | CustomEvent): JSONValue {
  return event instanceof CustomEvent ? event.detail : eventAsJSON(event);
}

export function eventAsJSON(event: Event): JSONValue {
  const obj = {};
  for (const key in event) {
    if (isPrimitive(event[key])) {
      obj[key] = event[key];
    }
  }
  return obj;
}
