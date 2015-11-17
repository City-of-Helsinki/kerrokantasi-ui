import render from '../server/render';
import {getRenderPromise} from './utils';
import React from 'react';
import Hearing from 'views/Hearing';

const data = require('./test-hearing-data.json');
const req = {url: "/hearing/f00f00"};
const state = {
  "hearing": {
    "f00f00": {
      state: "done",
      data: data
    }
  }
};

describe('Hearing rendered universally', () => {
  it('should assure us that it can render given the mock state', () => {
    expect(Hearing.canRenderFully(
      () => (state),
      {},
      {hearingId: "f00f00"}
    ));
  });
  it('should render something', () => {
    return getRenderPromise(req, state).then(({status, body}) => {
      expect(status).to.equal(200);
      expect(body).to.contain(data.heading);
    });
  });
});
