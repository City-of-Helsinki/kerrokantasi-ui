/* eslint-disable no-unused-expressions */
import React from 'react';
import { shallow } from 'enzyme';
import { Modal, ModalTitle } from 'react-bootstrap';
import { Button } from 'hds-react';
import { FormattedMessage } from 'react-intl';

import getMessage from '../../../src/utils/getMessage';
import SkipLinkModal from '../../../src/components/RichTextEditor/SkipLink/SkipLinkModal';
import RichTextModalTextField from '../../../src/components/RichTextEditor/RichTextModalTextField';

describe('SkipLinkModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSubmit: jest.fn(),
  };

  function getWrapper(props) {
    return shallow(<SkipLinkModal {...defaultProps} {...props} />);
  }

  describe('renders', () => {
    test('wrapping Modal', () => {
      const modal = getWrapper().find(Modal);
      expect(modal).toHaveLength(1);
      expect(modal.prop('show')).toBe(defaultProps.isOpen);
      expect(modal.prop('onHide')).toBe(defaultProps.onClose);
    });

    test('Modal.Header', () => {
      const header = getWrapper().find(Modal.Header);
      expect(header).toHaveLength(1);
      expect(header.prop('closeButton')).toBeDefined();
    });

    test('ModalTitle', () => {
      const title = getWrapper().find(ModalTitle);
      expect(title.prop('componentClass')).toBe('h3');
      const titleMsg = title.find(FormattedMessage);
      expect(titleMsg).toHaveLength(1);
      expect(titleMsg.prop('id')).toBe('skipLinkModalTitle');
    });

    test('Modal.Body', () => {
      const body = getWrapper().find(Modal.Body);
      expect(body).toHaveLength(1);
    });

    test('RichTextModalTextFields', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      const textFields = wrapper.find(RichTextModalTextField);
      const textFieldData = [
        { name: 'linkText', label: getMessage('skipLinkFormFieldText'), isRequired: true },
        { name: 'linkOwnId', label: getMessage('skipLinkFormFieldOwnId'), isRequired: true },
        { name: 'linkTargetId', label: getMessage('skipLinkFormFieldTargetId'), isRequired: true },
      ];
      expect(textFields).toHaveLength(textFieldData.length);
      textFields.forEach((field, index) => {
        expect(field.prop('name')).toBe(textFieldData[index].name);
        expect(field.prop('label')).toBe(textFieldData[index].label);
        expect(field.prop('handleInputChange')).toBe(instance.handleInputChange);
        expect(field.prop('handleInputBlur')).toBe(instance.handleInputBlur);
        expect(field.prop('value')).toBe(instance.state[textFieldData[index].name]);
        textFieldData[index].isRequired
          ? expect(field.prop('isRequired')).toBeDefined()
          : expect(field.prop('isRequired')).not.toBeDefined();
        expect(field.prop('errorMsg')).toBe(instance.state.inputErrors[textFieldData[index].name]);
        expect(field.prop('formName')).toBe('skip-link');
      });
    });

    describe('is hidden', () => {
      test('label', () => {
        const isHiddenLabel = getWrapper().find('.rich-text-editor-form-checkbox-label');
        expect(isHiddenLabel).toHaveLength(1);
        expect(isHiddenLabel.prop('htmlFor')).toBe('skip-link-is-hidden');
        expect(isHiddenLabel.text()).toBe(getMessage('skipLinkFormFieldHide'));
      });

      test('input', () => {
        const wrapper = getWrapper();
        const instance = wrapper.instance();
        const isHiddenInput = wrapper.find('#skip-link-is-hidden');
        expect(isHiddenInput).toHaveLength(1);
        expect(isHiddenInput.prop('type')).toBe('checkbox');
        expect(isHiddenInput.prop('name')).toBe('linkIsHidden');
        expect(isHiddenInput.prop('className')).toBe('rich-text-editor-form-checkbox-input');
        expect(isHiddenInput.prop('checked')).toBe(instance.state.linkIsHidden);
        expect(isHiddenInput.prop('onChange')).toBe(instance.handleInputChange);
      });
    });

    describe('footer', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      const footer = wrapper.find(Modal.Footer);
      test('Modal.Footer', () => {
        expect(footer).toHaveLength(1);
      });
      test('close button', () => {
        const closeButton = footer.find(Button).first();
        expect(closeButton.prop('onClick')).toBe(defaultProps.onClose);
        const closeButtonText = closeButton.find('FormattedMessage');
        expect(closeButtonText.prop('id')).toBe('cancel');
      });
      test('accept button', () => {
        const acceptButton = footer.find(Button).last();
        expect(acceptButton.prop('onClick')).toBe(instance.confirmSkipLink);
        const acceptButtonText = acceptButton.find('FormattedMessage');
        expect(acceptButtonText.prop('id')).toBe('formButtonAcceptAndAdd');
      });
      describe('form error text', () => {
        test('is shown when state.showFormErrorMsg is true', () => {
          instance.setState({ showFormErrorMsg: true });
          const errorText = wrapper.find('#skip-link-form-submit-error');
          expect(errorText).toHaveLength(1);
          expect(errorText.prop('role')).toBe('alert');
          expect(errorText.prop('className')).toBe('rich-text-editor-form-input-error');
          expect(errorText.text()).toBe(getMessage('formCheckErrors'));
        });
        test('is not shown when state.showFormErrorMsg is false', () => {
          instance.setState({ showFormErrorMsg: false });
          const errorText = wrapper.find('#skip-link-form-submit-error');
          expect(errorText).toHaveLength(0);
        });
      });
    });
  });

  describe('functions', () => {
    describe('handleInputChange', () => {
      test('updates given state input and its value', () => {
        const instance = getWrapper().instance();
        const event = { target: { type: 'text', name: 'linkText', value: 'test text' } };
        instance.handleInputChange(event);
        expect(instance.state.linkText).toBe('test text');
      });
      test('removes any errors from given input', () => {
        const instance = getWrapper().instance();
        const inputErrors = { linkText: 'error' };
        instance.setState({ linkText: '', inputErrors, showFormErrorMsg: true });
        const event = { target: { type: 'text', name: 'linkText', value: 'test text' } };
        instance.handleInputChange(event);
        expect(instance.state.inputErrors.linkText).toBe('');
      });
      test('sets showFormErrorMsg to false', () => {
        const instance = getWrapper().instance();
        instance.setState({ showFormErrorMsg: true });
        const event = { target: { type: 'text', name: 'linkText', value: 'test text' } };
        instance.handleInputChange(event);
        expect(instance.state.showFormErrorMsg).toBe(false);
      });
    });

    describe('handleInputBlur', () => {
      test('adds an error message for given input if it is required and falsy', () => {
        const instance = getWrapper().instance();
        instance.setState({ linkText: 'test' });
        const event = { target: { type: 'text', name: 'linkText', value: '', required: true } };
        instance.handleInputBlur(event);
        expect(instance.state.inputErrors.linkText).toBe(getMessage('validationCantBeEmpty'));
      });
      test('doesnt add error message for given input if input value is truthy', () => {
        const instance = getWrapper().instance();
        instance.setState({ linkText: '' });
        const event = { target: { type: 'text', name: 'linkText', value: 'abc', required: true } };
        instance.handleInputBlur(event);
        expect(instance.state.inputErrors.linkText).toBe('');
      });
      test('doesnt add error message for given input if input value is not required', () => {
        const instance = getWrapper().instance();
        instance.setState({ linkText: '' });
        const event = { target: { type: 'text', name: 'linkText', value: '', required: false } };
        instance.handleInputBlur(event);
        expect(instance.state.inputErrors.linkText).toBe('');
      });
    });

    describe('validateForm', () => {
      test('updates state inputErrors based on state input values', () => {
        const wrapper = getWrapper();
        const instance = wrapper.instance();
        instance.setState({ linkText: 'abc', linkOwnId: '', linkTargetId: '', inputErrors: { linkText: 'error' } });
        instance.validateForm();
        expect(instance.state.inputErrors.linkText).toBe('');
        expect(instance.state.inputErrors.linkOwnId).toBe(getMessage('validationCantBeEmpty'));
        expect(instance.state.inputErrors.linkTargetId).toBe(getMessage('validationCantBeEmpty'));
      });
    });

    describe('confirmSkipLink', () => {
      afterEach(() => {
        defaultProps.onSubmit.mockClear();
      });

      test('sets state.showFormErrorMsg to true if form contains errors', () => {
        const wrapper = getWrapper();
        const instance = wrapper.instance();
        instance.setState({ linkText: 'abc', linkOwnId: '', linkTargetId: '123' });
        instance.confirmSkipLink();
        expect(instance.state.showFormErrorMsg).toBe(true);
      });
      test('doesnt set state.showFormErrorMsg to true if form has no errors', () => {
        const wrapper = getWrapper();
        const instance = wrapper.instance();
        instance.setState({ linkText: 'abc', linkOwnId: 'abc', linkTargetId: '123', showFormErrorMsg: false });
        instance.confirmSkipLink();
        expect(instance.state.showFormErrorMsg).toBe(false);
      });
      test('calls props.onSubmit when form has no errors', () => {
        const wrapper = getWrapper();
        const instance = wrapper.instance();
        instance.setState({ linkText: 'text', linkOwnId: 'own id', linkTargetId: 'target id' });
        instance.confirmSkipLink();
        expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
        expect(defaultProps.onSubmit).toHaveBeenCalledWith('text', 'own id', 'target id', false);
      });
      test('sets state to initial state when form has no errors', () => {
        const wrapper = getWrapper();
        const instance = wrapper.instance();
        const initialState = { ...instance.state };
        instance.setState({ linkText: 'text', linkOwnId: 'own id', linkTargetId: 'target id' });
        instance.confirmSkipLink();
        expect(instance.state).toEqual(initialState);
      });
    });
  });
});
