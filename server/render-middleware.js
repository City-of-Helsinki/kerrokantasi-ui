import render from "./render";

export default function renderMiddleware(settings) {
  return (req, res, next) => {
    const {accept} = req.headers;
    if (req.method !== 'GET') {
      return next();
    }
    if (typeof accept !== 'string') {
      return next();
    }
    if (
      accept.indexOf('application/json') === 0 ||
      accept.indexOf('text/html') === -1 &&
      accept.indexOf('*/*') === -1
    ) {
      return next();
    }
    if (req.url.indexOf(".") > -1) {
      return next();
    }
    return render(req, res, settings);
  };
}
