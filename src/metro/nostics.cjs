// nostics is ESM-only (no CJS export). Vue Router uses it only for
// diagnostics which are not needed in production/RN, so we stub them out.
exports.defineDiagnostics = function (opts) { return opts }
exports.createConsoleReporter = function () { return { report: function () {} }
}
