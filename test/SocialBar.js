import {renderIntoDocument} from 'react-addons-test-utils';
import SocialBar from 'components/SocialBar';
import {findDOMNode} from 'react-dom';
import {wireComponent, createTestStore, domDescribe} from './utils';
import React from 'react';

domDescribe('SocialBar', () => {
  it('should have a container for Facebook Sharing', () => {
    const comp = renderIntoDocument(wireComponent({}, SocialBar));
    expect(findDOMNode(comp).querySelector(".fb-share-button")).to.be.ok;
  });
  it('should have a container for tweeting', () => {
    const comp = renderIntoDocument(wireComponent({}, SocialBar));
    expect(findDOMNode(comp).querySelector(".twitter-tweet-ctr")).to.be.ok;
  });
});
