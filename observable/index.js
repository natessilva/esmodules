function noop() {}

/**
 * Creates an `Observable`.
 *
 * @template T
 * @param {T} value initial value
 * @param {import('./private').StartStop<T>} [start]
 * @returns {import('./private').Observable<T>}
 */
export function observable(value, start = noop) {
  let stop = null;
  const subscribers = new Set();
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

  return { set, update, subscribe };
}

/**
 * Subscribes to many observables
 *
 * @template T
 * @param {import('./private').ManyObservable<T>} [observables]
 * @param {import('./private').ManySubscriber<T>} [fn]
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
 * Creates an Observable computed by subscriptions to many observables
 *
 * @template T
 * @template Y
 * @param {import('./private').ManyObservable<T>} [observables]
 * @param {import('./private').ManySubscriber<T,Y>} [fn]
 * @returns {import('./private').Observable<Y>}
 */
export function computed(observables, fn) {
  return {
    subscribe: observable(null, (set) => {
      return subscribeMany(observables, (values) => set(fn(values)));
    }).subscribe,
  };
}

/**
 * Gets a value from an Observable
 *
 * @template T
 * @param {import('./private').Observable<T>} [observable]
 * @returns {T}
 */
export function getValue(observable) {
  let value;
  observable.subscribe((v) => (value = v))();
  return value;
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
export function subEl(el, sub, fn) {
  el.addEventListener(sub, fn);

  return () => {
    el.removeEventListener(sub, fn);
  };
}
