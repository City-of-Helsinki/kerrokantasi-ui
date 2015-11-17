export function loadScriptThenCall(id, src, sentinel, fn) {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return false;
  }
  let timeout = null;
  const attemptLoad = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    const sentinelVal = window[sentinel];
    if (sentinelVal) { // Script has loaded; call fn and exit
      if (fn) {
        fn(sentinelVal);
        fn = null;  // eslint-disable-line no-param-reassign
      }
      return;
    }
    timeout = setTimeout(attemptLoad, 100);
  };
  if (!document.getElementById(id)) {
    const js = document.createElement("script");
    js.id = id;
    js.src = src;
    js.onload = () => {
      attemptLoad();
    };
    document.body.appendChild(js);
  }
  if (fn) {
    attemptLoad();
  }
}
