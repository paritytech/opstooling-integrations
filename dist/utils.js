"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultLogger = exports.lazyApi = void 0;
const opstooling_js_1 = require("opstooling-js");
function lazyApi(setup) {
    let promise;
    return (opts) => {
        if (promise === undefined) {
            promise = new Promise((resolve, reject) => {
                setup(opts).then(resolve, reject);
            });
        }
        return promise;
    };
}
exports.lazyApi = lazyApi;
// For cases if logger isn't passed into options, this one will be used
exports.defaultLogger = new opstooling_js_1.Logger({
    impl: console,
    logFormat: null,
    minLogLevel: "info",
    name: "default_logger",
});
//# sourceMappingURL=utils.js.map