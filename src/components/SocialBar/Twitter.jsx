import React from 'react';
import { Share } from 'react-twitter-widgets';

const Twitter = () => (
  <div className='twitter-tweet-ctr' style={{ marginRight: '8px' }}>
    <Share url={window.location.href} />
  </div>
);

export default Twitter;
