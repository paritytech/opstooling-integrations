import { Logger } from "opstooling-js";

export function lazyApi<T, O>(setup: (opts: O) => Promise<T>): (opts: O) => Promise<T> {
  let promise: Promise<T>;

  return (opts: O) => {
    if (promise === undefined) {
      promise = new Promise((resolve, reject) => {
        setup(opts).then(resolve, reject);
      });
    }

    return promise;
  };
}

// For cases if logger isn't passed into options, this one will be used
export const defaultLogger = new Logger({
  impl: console,
  logFormat: null,
  minLogLevel: "info",
  name: "default_logger",
});
