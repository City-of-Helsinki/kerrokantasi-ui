import React from 'react';
import { shallow } from 'enzyme';
import IframeTextField from '../../../src/components/RichTextEditor/Iframe/IframeTextField';

describe('IframeTextField', () => {
  const defaultProps = {
    name: "test-name",
    label: "test-label",
    handleInputChange: jest.fn(),
    handleInputBlur: jest.fn(),
    value: "test-value",
  };

  function getWrapper(props) {
    return shallow(<IframeTextField {...defaultProps} {...props}/>);
  }

  describe('renders', () => {
    test('wrapping div', () => {
      const div = getWrapper().find('.input-container');
      expect(div).toHaveLength(1);
    });
    describe('label with correct props', () => {
      test('when field is not required', () => {
        const isRequired = false;
        const label = getWrapper({isRequired}).find('label');
        expect(label).toHaveLength(1);
        expect(label.prop('htmlFor')).toBe(`iframe-${defaultProps.name}`);
        expect(label.text()).toBe(defaultProps.label + " ");
      });
      test('when field is required', () => {
        const isRequired = true;
        const label = getWrapper({isRequired}).find('label');
        expect(label).toHaveLength(1);
        expect(label.prop('htmlFor')).toBe(`iframe-${defaultProps.name}`);
        expect(label.text()).toBe(defaultProps.label + " *");
      });
    });

    describe('input', () => {
      test('with correct props', () => {
        const input = getWrapper().find('input');
        expect(input).toHaveLength(1);
        expect(input.prop('name')).toBe(defaultProps.name);
        expect(input.prop('className')).toBe("form-control");
        expect(input.prop('onChange')).toBe(defaultProps.handleInputChange);
        expect(input.prop('onBlur')).toBe(defaultProps.handleInputBlur);
        expect(input.prop('value')).toBe(defaultProps.value);
        expect(input.prop('type')).toBe('text');
        expect(input.prop('required')).toBe(defaultProps.isRequired);
      });
      test('prop aria-describedby is undefined when errorMsg is falsy', () => {
        const input = getWrapper({errorMsg: ''}).find('input');
        expect(input.prop('aria-describedby')).toBe(undefined);
      });
      test('prop aria-describedby is correct value when errorMsg is not falsy', () => {
        const errorId = `iframe-input-error-${defaultProps.name}`;
        const errorMsg = "error-text";
        const input = getWrapper({errorMsg}).find('input');
        expect(input.prop('aria-describedby')).toBe(errorId);
      });
    });

    describe('errorMsg paragraph', () => {
      test('when prop errorMsg is not falsy', () => {
        const errorId = `iframe-input-error-${defaultProps.name}`;
        const errorMsg = "error-text";
        const errorParagraph = getWrapper({errorMsg}).find('#' + errorId);
        expect(errorParagraph).toHaveLength(1);
        expect(errorParagraph.prop('role')).toBe('alert');
        expect(errorParagraph.prop('className')).toBe('iframe-input-error');
        expect(errorParagraph.text()).toBe(errorMsg);
      });
      test('is not rendered if errorMsg is falsy', () => {
        const errorId = `iframe-input-error-${defaultProps.name}`;
        const errorMsg = "";
        const errorParagraph = getWrapper({errorMsg}).find('#' + errorId);
        expect(errorParagraph).toHaveLength(0);
      });
    });
  });

  test('input onChange calls props.handleInputChange', () => {
    const event = {
      target: { value: 'test-text-change' }
    };
    const input = getWrapper().find('input');
    input.simulate('change', event);
    expect(defaultProps.handleInputChange).toBeCalledWith(event);
  });

  test('input onChange calls props.handleInputBlur', () => {
    const event = {
      target: { value: 'test-text-blur' }
    };
    const input = getWrapper().find('input');
    input.simulate('blur', event);
    expect(defaultProps.handleInputBlur).toBeCalledWith(event);
  });
});
