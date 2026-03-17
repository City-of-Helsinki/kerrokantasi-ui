/**
 * Sends a message to a plugin iframe, targeting the iframe's own origin.
 *
 * @param {HTMLIFrameElement} frame - The iframe element.
 * @param {any} message - The message to send.
 */
export const sendMessageToPluginFrame = (frame, message) => {
  if (!frame.src) {
    return;
  }
  const frameOrigin = new URL(frame.src, globalThis.location.href).origin;
  frame.contentWindow.postMessage(message, frameOrigin);
};
