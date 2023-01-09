import { Logger } from "opstooling-js";
export declare function lazyApi<T, O>(setup: (opts: O) => Promise<T>): (opts: O) => Promise<T>;
export declare const defaultLogger: Logger;
