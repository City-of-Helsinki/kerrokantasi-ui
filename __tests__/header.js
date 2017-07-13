import {renderIntoDocument} from 'react-addons-test-utils';
import Header from '../src/components/Header';
import {findDOMNode} from 'react-dom';
import {wireComponent} from '../test-utils';

describe('Header', () => {
  it('should show a login link when not logged in', () => {
    const comp = renderIntoDocument(wireComponent({user: {data: null} }, Header));
    expect(findDOMNode(comp).querySelector(".login-link")).toBeTruthy();
  });
  it('should show an username when logged in', () => {
    const comp = renderIntoDocument(wireComponent({user: {data: {id: "fff", displayName: "Mock von User"}}}, Header));
    expect(findDOMNode(comp).querySelector(".login-link")).not.toBeTruthy();
    expect(findDOMNode(comp).innerHTML).toContain("Mock von User");
  });
});
