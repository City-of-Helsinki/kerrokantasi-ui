import React from 'react';
import { shallow } from 'enzyme';

import IframeCopyPasteField from '../../../src/components/RichTextEditor/Iframe/IframeCopyPasteField';
import getMessage from '../../../src/utils/getMessage';
import {
  parseIframeHtml,
  convertStyleDimensionSettings,
} from '../../../src/components/RichTextEditor/Iframe/IframeUtils';

describe('IframeSelectField', () => {
  const defaultProps = {
    updateAttributes: jest.fn(),
  };

  function getWrapper(props) {
    return shallow(<IframeCopyPasteField {...defaultProps} {...props} />);
  }

  describe('renders', () => {
    test('wrapping div', () => {
      const div = getWrapper().find('.html-copy-paste-input');
      expect(div).toHaveLength(1);
    });

    test('label', () => {
      const label = getWrapper().find('label');
      expect(label).toHaveLength(1);
      expect(label.prop('htmlFor')).toBe('iframe-html-copy-paste');
      expect(label.text()).toBe(getMessage('iframeHtmlCopyPaste'));
    });

    test('textarea', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      const textarea = wrapper.find('textarea');
      expect(textarea).toHaveLength(1);
      expect(textarea.prop('id')).toBe('iframe-html-copy-paste');
      expect(textarea.prop('name')).toBe('htmlCopyPaste');
      expect(textarea.prop('className')).toBe('form-control');
      expect(textarea.prop('onChange')).toBe(instance.handleCopyPasteChange);
      expect(textarea.prop('value')).toBe(instance.state.htmlCopyPaste);
    });
  });

  describe('functions', () => {
    describe('handleCopyPasteChange', () => {
      afterEach(() => {
        jest.clearAllMocks();
      });

      test('updates state.htmlCopyPaste value', () => {
        const instance = getWrapper().instance();
        instance.state.htmlCopyPaste = 'old-value';
        const event = { target: { value: 'new-value' } };
        instance.handleCopyPasteChange(event);
        expect(instance.state.htmlCopyPaste).toBe('new-value');
      });
      test('calls props.updateAttributes', () => {
        const instance = getWrapper().instance();
        const event = { target: { value: '<iframe title="test-title" style="width: 150px;"></iframe>' } };
        instance.handleCopyPasteChange(event);
        expect(defaultProps.updateAttributes.mock.calls.length).toBe(1);
        expect(defaultProps.updateAttributes.mock.calls[0][0]).toEqual(
          convertStyleDimensionSettings(parseIframeHtml(event.target.value)),
        );
      });
    });
  });
});
