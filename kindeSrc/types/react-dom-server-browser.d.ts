// @types/react-dom ships no declaration for the browser server build that
// Kinde's runtime uses, so re-export the types of the Node build, which has
// the same renderToString signature.
declare module "react-dom/server.browser" {
  export { renderToString, renderToStaticMarkup } from "react-dom/server";
}
