import React from 'react';
import {shallow} from "enzyme";
import { Button, Modal } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

import CommentReportModal from '../../src/components/CommentReportModal/CommentReportModal';
import { mockStore } from '../../test-utils';
import getMessage from '../../src/utils/getMessage';
import CommentReportForm from '../../src/components/CommentReportModal/CommentReportForm';

describe('CommentReportModal', () => {
  const defaultProps = {
    hearing: mockStore.mockHearingWithSections,
    isOpen: false,
    onClose: () => {},
  };

  function getWrapper(props) {
    return (shallow(<CommentReportModal {...defaultProps} {...props} />));
  }

  describe('renders', () => {
    test('wrapper modal', () => {
      const modal = getWrapper().find(Modal);
      expect(modal).toHaveLength(1);
      expect(modal.prop('animation')).toBe(false);
      expect(modal.prop('className')).toBe('comment-reports-modal');
      expect(modal.prop('onHide')).toBe(defaultProps.onClose);
      expect(modal.prop('show')).toBe(defaultProps.isOpen);
    });

    test('modal header', () => {
      const header = getWrapper().find(Modal.Header);
      expect(header).toHaveLength(1);
      expect(header.prop('closeButton')).toBe(true);
      expect(header.prop('closeLabel')).toBe(getMessage('commentReportsClose'));
    });

    test('modal title', () => {
      const title = getWrapper().find(Modal.Title);
      expect(title).toHaveLength(1);
      expect(title.prop('componentClass')).toBe('h1');
    });

    test('modal title text', () => {
      const text = getWrapper().find(Modal.Title).find(FormattedMessage);
      expect(text).toHaveLength(1);
      expect(text.prop('id')).toBe('commentReportsTitle');
    });

    test('modal body', () => {
      const body = getWrapper().find(Modal.Body);
      expect(body).toHaveLength(1);
    });

    test('modal body form', () => {
      const form = getWrapper().find(Modal.Body).find(CommentReportForm);
      expect(form).toHaveLength(1);
      expect(form.prop('hearing')).toBe(defaultProps.hearing);
    });

    test('modal footer', () => {
      const footer = getWrapper().find(Modal.Footer);
      expect(footer).toHaveLength(1);
    });

    test('modal footer button', () => {
      const button = getWrapper().find(Modal.Footer).find(Button);
      expect(button).toHaveLength(1);
      expect(button.prop('onClick')).toBe(defaultProps.onClose);
    });

    test('modal footer button text', () => {
      const text = getWrapper().find(Modal.Footer).find(Button).find(FormattedMessage);
      expect(text).toHaveLength(1);
      expect(text.prop('id')).toBe('commentReportsClose');
    });
  });
});
