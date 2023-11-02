/* eslint-disable no-console */
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Basic configuration of Jest + Enzyme tests on React v15
configure({ adapter: new Adapter() });

// Needed for tests to work with react-slick, check https://github.com/akiran/react-slick#test-setup
window.matchMedia = window.matchMedia || function () {
  return {
    matches: false,
    addListener: () => { },
    removeListener: () => { }
  };
};


const originalError = console.error.bind(console.error);

console.error = (msg, ...optionalParams) => {
  const msgStr = msg.toString();

  return (
    !msgStr.includes('Could not parse CSS stylesheet') &&
    originalError(msg, ...optionalParams)
  );
};
