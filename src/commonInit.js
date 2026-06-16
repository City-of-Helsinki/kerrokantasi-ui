// Init to be run both on server and client
import noop from 'lodash/noop';

let done = false;

export default function commonInit(cb = noop) {
  if (done) {
    return;
  }
  done = true;
  cb();
}
