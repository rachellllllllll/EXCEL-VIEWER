import { Buffer } from 'buffer';

if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
  (window as any).global = window;
  (window as any).process = {
    env: {},
    nextTick: (fn: Function, ...args: any[]) => setTimeout(() => fn(...args), 0)
  };
 
  // הוסף polyfill עבור setImmediate
  if (!(window as any).setImmediate) {
    (window as any).setImmediate = (fn: Function, ...args: any[]) => setTimeout(() => fn(...args), 0);
  }
}

