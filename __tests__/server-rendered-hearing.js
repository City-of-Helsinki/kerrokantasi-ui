import {getRenderPromise, withAndWithoutUser} from '../test-utils';
import Hearing from '../src/views/Hearing';
import Helmet from 'react-helmet';

const data = require('./test-hearing-data.json');
const req = {url: "/hearing/f00f00"};
const hearingState = {
  hearing: {
    f00f00: {data, state: "done"}
  }
};

describe('Hearing rendered universally', () => {
  const oldCanUseDOM = Helmet.canUseDOM;
  beforeAll(() => {
    Helmet.canUseDOM = false;  // Pretend we're not DOMmy, so Helmet.rewind() works
  });
  afterAll(() => {
    Helmet.canUseDOM = oldCanUseDOM;
  });

  withAndWithoutUser(hearingState, ({state, message}) => {
    it('should assure us that it can render given the mock state ' + message, () => {
      expect(Hearing.canRenderFully(
        () => (state),
        {},
        {hearingId: "f00f00"}
      ));
    });
    it('should render something ' + message, () => {
      return getRenderPromise(req, state).then(({status, body}) => {
        expect(status).toEqual(200);
        expect(body).toContain(data.title);
      });
    });
  });
});
