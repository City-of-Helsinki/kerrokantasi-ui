import React from 'react';
import {shallow} from 'enzyme';
import CommentFormErrors from '../../src/components/CommentFormErrors';
import { getIntlAsProp } from '../../test-utils';
import { FormattedMessage } from 'react-intl';

describe('CommentFormErrors', () => {
  const defaultProps = {
    commentRequiredError: false,
    commentOrAnswerRequiredError: false,
    imageTooBig: false,
  };

  function getWrapper(props) {
    return (shallow(<CommentFormErrors intl={getIntlAsProp()} {...defaultProps} {...props} />));
  }

  describe('renders', () => {
    test('nothing when no errors are present', () => {
      const commentFormErrors = getWrapper();
      expect(commentFormErrors.isEmptyRender()).toBe(true);
    });

    describe('when there are errors', () => {
      test('wrapping ul', () => {
        const ulElement = getWrapper({commentRequiredError: true}).find('ul');
        expect(ulElement).toHaveLength(1);
        expect(ulElement.prop('role')).toBe('alert');
        expect(ulElement.prop('className')).toBe('comment-form-errors');
      });

      describe('correct list item', () => {
        test('when there is comment required error', () => {
          const liElement = getWrapper({commentRequiredError: true}).find('li');
          expect(liElement).toHaveLength(1);
          const text = liElement.find(FormattedMessage);
          expect(text).toHaveLength(1);
          expect(text.prop('id')).toBe("commentRequiredError");
        });

        test('when there is comment or answer required error', () => {
          const liElement = getWrapper({commentOrAnswerRequiredError: true}).find('li');
          expect(liElement).toHaveLength(1);
          const text = liElement.find(FormattedMessage);
          expect(text).toHaveLength(1);
          expect(text.prop('id')).toBe("commentOrAnswerRequiredError");
        });

        test('when there is image size error', () => {
          const liElement = getWrapper({imageTooBig: true}).find('li');
          expect(liElement).toHaveLength(1);
          const text = liElement.find(FormattedMessage);
          expect(text).toHaveLength(1);
          expect(text.prop('id')).toBe("imageSizeError");
        });
      });
    });
  });
});
