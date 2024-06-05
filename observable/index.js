function noop() {}

/**
 * Creates a writable observable.
 *
 * @template T
 * @param {T} value initial value
 * @param {import('./private').StartStop<T>} [start]
 * @returns {import('./private').Writable<T>}
 */
export function writable(value, start = noop) {
  let stop = null;
  const subscribers = new Set();

  const get = () => value;

  const set = (v) => {
    if (v === value) {
      return;
    }
    value = v;
    if (stop == null) {
      return;
    }
    subscribers.forEach((fn) => fn(value));
  };

  const update = (fn) => set(fn(value));

  const subscribe = (fn) => {
    subscribers.add(fn);
    if (subscribers.size == 1) {
      stop = start(set, update) ?? noop;
    }
    fn(value);
    return () => {
      subscribers.delete(fn);
      if (subscribers.size == 0) {
        stop();
        stop = null;
      }
    };
  };

  return { get, set, update, subscribe };
}

/**
 * Creates a readonly observable
 *
 * @template T
 * @param {T} value initial value
 * @param {import('./private').StartStop<T>} [start]
 * @returns {import('./private').Readable<T>}
 */
export function readable(value, start = noop) {
  const { get, subscribe } = writable(value, start);
  return { get, subscribe };
}

/**
 * Subscribes to many observables
 *
 * @template T
 * @template Y
 * @param {import('./private').ManyReadable<T>} observables
 * @param {import('./private').ManySubscriber<T,Y>} fn
 * @returns {import('./private').Unsubscriber}
 */
export function subscribeMany(observables, fn) {
  const values = [];
  let started = false;
  const subs = observables.map((ob, i) =>
    ob.subscribe((v) => {
      values[i] = v;
      if (started) {
        fn(values);
      }
    })
  );
  started = true;
  fn(values);
  return () => {
    subs.forEach((sub) => sub());
  };
}

/**
 * Creates an observable computed via subscriptions to many observables
 *
 * @template T
 * @template Y
 * @param {import('./private').ManyReadable<T>} [observables]
 * @param {import('./private').ManySubscriber<T,Y>} [fn]
 * @returns {import('./private').Readable<Y>}
 */
export function computed(observables, fn) {
  return readable(null, (set) => {
    return subscribeMany(observables, (values) => set(fn(values)));
  });
}

/**
 * Creates a DOM subscription via addEventListener and returns an Unsubscriber
 *
 * @template {keyof HTMLElementEventMap} K
 * @param {HTMLElement} el
 * @param {K} sub
 * @param {(this: HTMLElement, ev: HTMLElementEventMap[K]) => any} fn
 * @returns {import('./private').Unsubscriber}
 */
export function subEventListener(el, sub, fn) {
  el.addEventListener(sub, fn);

  return () => {
    el.removeEventListener(sub, fn);
  };
}
