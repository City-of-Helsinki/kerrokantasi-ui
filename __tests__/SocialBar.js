/* eslint-disable react/no-find-dom-node */
import {renderIntoDocument} from 'react-dom/test-utils';
import SocialBar from '../src/components/SocialBar';
import {findDOMNode} from 'react-dom';
import {wireComponent} from '../test-utils';

describe('SocialBar', () => {
  it('should have a container for Facebook Sharing', () => {
    const comp = renderIntoDocument(wireComponent({}, SocialBar));
    expect(findDOMNode(comp).querySelector(".fb-share-button")).toBeTruthy();
  });
  it('should have a container for tweeting', () => {
    const comp = renderIntoDocument(wireComponent({}, SocialBar));
    expect(findDOMNode(comp).querySelector(".twitter-tweet-ctr")).toBeTruthy();
  });
});
