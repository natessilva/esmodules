export type Subscriber<T> = (value: T) => void;

export type Unsubscriber = () => void;

export type Updater<T> = (value: T) => T;

export type StartStop<T> = (
  set: (value: T) => void,
  update: (fn: Updater<T>) => void
) => void | (() => void);

export interface Observable<T> {
  subscribe(run: Subscriber<T>): Unsubscriber;

  set(value: T): void;

  update(updater: Updater<T>): void;
}

export type Tuple<T> = { [K in keyof T]: T[K] };
export type ObservableTuple<T> = { [K in keyof T]: Observable<T[K]> };
export type ManyObservable<T extends unknown[]> = [...ObservableTuple<T>];
export type ManySubscriber<T extends readonly unknown[], Y = void> = (
  values: readonly [...Tuple<T>]
) => Y;
