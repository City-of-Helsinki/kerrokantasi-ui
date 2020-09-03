import React from 'react';
import { shallow } from 'enzyme';
import {Modal, Button, ModalTitle } from 'react-bootstrap';
import {FormattedMessage} from 'react-intl';
import IframeModal from '../../../src/components/RichTextEditor/Iframe/IframeModal';
import IframeCopyPasteField from '../../../src/components/RichTextEditor/Iframe/IframeCopyPasteField';
import IframeTextField from '../../../src/components/RichTextEditor/Iframe/IframeTextField';
import IframeSelectField from '../../../src/components/RichTextEditor/Iframe/IframeSelectField';
import {validateInput} from '../../../src/components/RichTextEditor/Iframe/IframeUtils';

import getMessage from '../../../src/utils/getMessage';


describe('IframeSelectField', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSubmit: jest.fn(),
  };

  function getWrapper(props) {
    return shallow(<IframeModal {...defaultProps} {...props}/>);
  }

  describe('renders', () => {
    test('wrapping Modal', () => {
      const modal = getWrapper().find(Modal);
      expect(modal).toHaveLength(1);
      expect(modal.prop('show')).toBe(defaultProps.isOpen);
      expect(modal.prop('onHide')).toBeDefined();
    });

    test('Modal.Header', () => {
      const header = getWrapper().find(Modal.Header);
      expect(header).toHaveLength(1);
      expect(header.prop('closeButton')).toBeDefined();
    });

    test('ModalTitle', () => {
      const title = getWrapper().find(ModalTitle);
      expect(title.prop('componentClass')).toBe("h3");
      const titleMsg = title.find(FormattedMessage);
      expect(titleMsg).toHaveLength(1);
      expect(titleMsg.prop('id')).toBe('iframeModalTitle');
    });

    test('Modal.Body', () => {
      const body = getWrapper().find(Modal.Body);
      expect(body).toHaveLength(1);
    });

    test('form', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      const form = getWrapper().find('form');
      expect(form).toHaveLength(1);
      expect(form.prop('onSubmit')).toBe(instance.submitForm);
    });

    test('IframeCopyPasteField', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      const field = wrapper.find(IframeCopyPasteField);
      expect(field).toHaveLength(1);
      expect(field.prop('updateAttributes')).toBe(instance.updateAttributes);
    });

    test('hr spacer', () => {
      expect(getWrapper().find('hr')).toHaveLength(1);
    });

    test('IframeTextFields', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      const textFields = wrapper.find(IframeTextField);
      const textFieldData = [
        {name: 'title', label: getMessage('iframeFormFieldTitle'), isRequired: true},
        {name: 'src', label: getMessage('iframeFormFieldSrc'), isRequired: true},
        {name: 'width', label: getMessage('iframeFormFieldWidth')},
        {name: 'height', label: getMessage('iframeFormFieldHeight')},
        {name: 'allow', label: getMessage('iframeFormFieldAllow')},
      ];
      expect(textFields).toHaveLength(textFieldData.length);
      textFields.forEach((field, index) => {
        expect(field.prop('name')).toBe(textFieldData[index].name);
        expect(field.prop('label')).toBe(textFieldData[index].label);
        expect(field.prop('handleInputChange')).toBe(instance.handleInputChange);
        expect(field.prop('handleInputBlur')).toBe(instance.handleInputBlur);
        expect(field.prop('value')).toBe(instance.state[textFieldData[index].name]);
        textFieldData[index].isRequired ?
          expect(field.prop('isRequired')).toBeDefined() : expect(field.prop('isRequired')).not.toBeDefined();
        expect(field.prop('errorMsg')).toBe(instance.state.inputErrors[textFieldData[index].name]);
      });
    });

    test('IframeSelectField', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      const selectField = wrapper.find(IframeSelectField);
      const scrollingOptions = [
        {value: "no", text: getMessage('generalNo')},
        {value: "yes", text: getMessage('generalYes')},
        {value: "auto", text: 'auto'},
      ];
      expect(selectField).toHaveLength(1);
      expect(selectField.prop('name')).toBe('scrolling');
      expect(selectField.prop('label')).toBe(getMessage('iframeFormFieldScrolling'));
      expect(selectField.prop('value')).toBe(instance.state.scrolling);
      expect(selectField.prop('options')).toEqual(scrollingOptions);
    });

    describe('footer', () => {
      const footer = getWrapper().find(Modal.Footer);
      test('Modal.Footer', () => {
        expect(footer).toHaveLength(1);
      });
      test('close button', () => {
        const closeButton = footer.find(Button).first();
        expect(closeButton.prop('onClick')).toBeDefined();
        const closeButtonText = closeButton.find('FormattedMessage');
        expect(closeButtonText.prop('id')).toBe('cancel');
      });
      test('accept button', () => {
        const acceptButton = footer.find(Button).last();
        expect(acceptButton.prop('onClick')).toBeDefined();
        expect(acceptButton.prop('bsStyle')).toBe('primary');
        const acceptButtonText = acceptButton.find('FormattedMessage');
        expect(acceptButtonText.prop('id')).toBe('iframeFormButtonAcceptAndAdd');
      });
      describe('form error text', () => {
        test('is shown when state.showFormErrorMsg is true', () => {
          const wrapper = getWrapper();
          const instance = wrapper.instance();
          instance.setState({showFormErrorMsg: true});
          const errorText = wrapper.find('#iframe-form-submit-error');
          expect(errorText).toHaveLength(1);
          expect(errorText.prop('role')).toBe('alert');
          expect(errorText.prop('className')).toBe('iframe-input-error');
        });
        test('is not shown when state.showFormErrorMsg is false', () => {
          const wrapper = getWrapper();
          const instance = wrapper.instance();
          instance.setState({showFormErrorMsg: false});
          const errorText = wrapper.find('#iframe-form-submit-error');
          expect(errorText).toHaveLength(0);
        });
      });
    });
  });

  describe('functions', () => {
    describe('updateAttributes', () => {
      test('updates state with given input', () => {
        const instance = getWrapper().instance();
        const attributes = {title: "some title", src: "https://google.fi"};
        instance.updateAttributes(attributes);
        expect(instance.state.title).toBe("some title");
        expect(instance.state.src).toBe("https://google.fi");
      });
      test('removes error messages', () => {
        const instance = getWrapper().instance();
        instance.setState({showFormErrorMsg: true, inputErrors: {title: "some error"}});
        const attributes = {title: "some title", src: "https://google.fi"};
        instance.updateAttributes(attributes);
        expect(instance.state.inputErrors.title).toBe("");
        expect(instance.state.showFormErrorMsg).toBe(false);
      });
    });

    describe('handleInputChange', () => {
      test('updates given state input and its value', () => {
        const instance = getWrapper().instance();
        const event = {target: {type: 'text', name: 'title', value: 'test name'}};
        instance.handleInputChange(event);
        expect(instance.state.title).toBe('test name');
      });
      test('removes any errors from given input', () => {
        const instance = getWrapper().instance();
        const inputErrors = {title: 'some error'};
        instance.setState({title: 'this title has an error', inputErrors});
        const event = {target: {type: 'text', name: 'title', value: 'test name'}};
        instance.handleInputChange(event);
        expect(instance.state.inputErrors.title).toBe('');
      });
    });

    describe('handleInputBlur', () => {
      test('updates given state input and its value', () => {
        const instance = getWrapper().instance();
        const event = {target: {type: 'text', name: 'title', value: 'test name'}};
        instance.handleInputBlur(event);
        expect(instance.state.title).toBe(event.target.value);
      });
      test('adds an error message for given input if it fails validation', () => {
        const instance = getWrapper().instance();
        instance.setState({title: 'test'});
        const event = {target: {type: 'text', name: 'title', value: ''}};
        instance.handleInputBlur(event);
        const errorMsg = validateInput(event.target.name, event.target.value);
        expect(instance.state.inputErrors.title).toBe(errorMsg);
      });
    });
  });
});
