import {renderIntoDocument} from 'react-dom/test-utils';
import Comment from '../src/components/Hearing/Comment';
import {findDOMNode} from 'react-dom';
import {wireComponent} from '../test-utils';

describe('Comment', () => {
  it('should be able to render an anonymous comment without crashing', () => {
    const anonComment = {
      "id": "f00f00",
      "hearing": "f00f00",
      "content": "Reiciendis",
      "n_votes": 2,
      "created_by": null,
      "created_at": "2015-11-16T09:25:37.625607Z",
      "answers": []
    };
    const comp = renderIntoDocument(wireComponent({}, Comment, {data: anonComment}));
    expect(findDOMNode(comp).className).toContain("hearing-comment");
  });

  it('should have a clickable voting thumb', () => {
    const anonComment = {
      "id": "f00f00",
      "hearing": "f00f00",
      "content": "Reiciendis",
      "n_votes": 2,
      "created_by": null,
      "created_at": "2015-11-16T09:25:37.625607Z",
      "answers": []
    };
    const comp = renderIntoDocument(wireComponent({}, Comment, {data: anonComment}));
    const voteBtn = findDOMNode(comp).getElementsByClassName("hearing-comment-votes")[0];
    expect(voteBtn.innerHTML).toContain("button");
  });
});
