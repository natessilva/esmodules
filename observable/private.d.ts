export type Subscriber<T> = (value: T) => void;

export type Unsubscriber = () => void;

export type Updater<T> = (value: T) => T;

export type StartStop<T> = (
  set: (value: T) => void,
  update: (fn: Updater<T>) => void
) => void | (() => void);

export interface Readable<T> {
  subscribe(run: Subscriber<T>): Unsubscriber;
  get(): T;
}

export interface Writable<T> extends Readable<T> {
  set(value: T): void;
  update(updater: Updater<T>): void;
}

export type Tuple<T> = { [K in keyof T]: T[K] };
export type ReadableTuple<T> = { [K in keyof T]: Readable<T[K]> };
export type ManyReadable<T extends readonly unknown[]> = readonly [
  ...ReadableTuple<T>
];
export type ManySubscriber<T extends readonly unknown[], Y = void> = (
  values: readonly [...Tuple<T>]
) => Y;
