/* eslint-disable no-console */
import {getCompiler} from '../server/bundler';
import getSettings from '../server/getSettings';

export default function compile() {
  const settings = getSettings();
  let compiler = getCompiler(settings, true);

  compiler.run((err) => {
    if (err) {
      throw new Error(`Webpack error: ${err}`);
    }
    // Throw the webpack into the well (if this was the last reference to it, we reclaim plenty of memory)
    compiler = null;
  });
}
