import React from 'react';
import { shallow } from 'enzyme';

import IframeSelectField from '../../../src/components/RichTextEditor/Iframe/IframeSelectField';

describe('IframeSelectField', () => {
  const defaultProps = {
    name: "test-name",
    label: "test-label",
    handleInputChange: jest.fn(),
    value: "test-value",
    options: [{value: "no", text: "text-no"}, {value: "yes", text: "text-yes"}]
  };

  function getWrapper(props) {
    return shallow(<IframeSelectField {...defaultProps} {...props}/>);
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
        expect(label.text()).toBe(`${defaultProps.label  } `);
      });
      test('when field is required', () => {
        const isRequired = true;
        const label = getWrapper({isRequired}).find('label');
        expect(label).toHaveLength(1);
        expect(label.prop('htmlFor')).toBe(`iframe-${defaultProps.name}`);
        expect(label.text()).toBe(`${defaultProps.label  } *`);
      });
    });

    describe('select', () => {
      test('with correct props', () => {
        const input = getWrapper().find('select');
        expect(input).toHaveLength(1);
        expect(input.prop('name')).toBe(defaultProps.name);
        expect(input.prop('className')).toBe("rich-text-editor-form-select-input");
        expect(input.prop('onChange')).toBe(defaultProps.handleInputChange);
        expect(input.prop('value')).toBe(defaultProps.value);
      });
    });

    describe('options', () => {
      test('with correct props', () => {
        const options = getWrapper().find('option');
        expect(options).toHaveLength(defaultProps.options.length);
        options.forEach((option, index) => {
          expect(option.prop('value')).toBe(defaultProps.options[index].value);
          expect(option.text()).toBe(defaultProps.options[index].text);
        });
      });
    });

    describe('errorMsg paragraph', () => {
      test('when prop errorMsg is not falsy', () => {
        const errorId = `iframe-input-error-${defaultProps.name}`;
        const errorMsg = "error-text";
        const errorParagraph = getWrapper({errorMsg}).find(`#${  errorId}`);
        expect(errorParagraph).toHaveLength(1);
        expect(errorParagraph.prop('role')).toBe('alert');
        expect(errorParagraph.prop('className')).toBe('iframe-input-error');
        expect(errorParagraph.text()).toBe(errorMsg);
      });
      test('is not rendered if errorMsg is falsy', () => {
        const errorId = `iframe-input-error-${defaultProps.name}`;
        const errorMsg = "";
        const errorParagraph = getWrapper({errorMsg}).find(`#${  errorId}`);
        expect(errorParagraph).toHaveLength(0);
      });
    });
  });

  test('input onChange calls props.handleInputChange', () => {
    const event = {
      target: { value: 'test-text-change' }
    };
    const input = getWrapper().find('select');
    input.simulate('change', event);
    expect(defaultProps.handleInputChange).toBeCalledWith(event);
  });
});
