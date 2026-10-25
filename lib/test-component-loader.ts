import { register } from "node:module";

/*
 * Test-only loader: CSS modules resolve to their class names and next/image
 * renders nothing, so real components can be rendered in Node. Import this
 * before dynamically importing any component.
 */
register(
  "data:text/javascript," +
    encodeURIComponent(`
      const image = "data:text/javascript," + encodeURIComponent("export default () => null;");
      export async function resolve(specifier, context, next) {
        if (specifier === "next/image") return { url: image, shortCircuit: true };
        return next(specifier, context);
      }
      export async function load(url, context, next) {
        if (url.endsWith(".css")) {
          return { format: "module", shortCircuit: true, source: "export default new Proxy({}, { get: (_, key) => String(key) });" };
        }
        return next(url, context);
      }
    `)
);
