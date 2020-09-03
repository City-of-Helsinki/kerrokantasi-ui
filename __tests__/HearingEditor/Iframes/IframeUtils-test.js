import {
  stripWrappingFigureTags,
  stripIframeWrapperDivs,
  addIframeWrapperDivs,
  parseIframeHtml,
  validateIsNotEmpty,
  validateIsNumber,
  IFRAME_VALIDATION,
  validateInput,
  validateForm,
  isFormValid,
} from '../../../src/components/RichTextEditor/Iframe/IframeUtils';

describe('IframeUtils', () => {
  describe('stripWrappingFigureTags', () => {
    test('removes figure tags surrounding iframe tags and returns the result', () => {
      const htmlString = '<div><figure><iframe></iframe></figure><figure><p>text</p></figure></div>';
      const expectedResult = '<div><iframe></iframe><figure><p>text</p></figure></div>';
      expect(stripWrappingFigureTags(htmlString)).toBe(expectedResult);
    });
  });

  describe('stripIframeWrapperDivs', () => {
    test('removes div.iframe-wrapper tags surrounding iframe tags and returns the result', () => {
      const htmlString = `<div class="iframe-wrapper"><iframe src="https://google.fi">
      </iframe></div><p>text</p><div class="iframe-wrapper"><iframe src="https://google.fi">
      </iframe></div><div><iframe></iframe></div><div><iframe></iframe></div>`;
      const expectedResult = `<iframe src="https://google.fi">
      </iframe><p>text</p><iframe src="https://google.fi">
      </iframe><div><iframe></iframe></div><div><iframe></iframe></div>`;
      expect(stripIframeWrapperDivs(htmlString)).toBe(expectedResult);
    });
  });

  describe('addIframeWrapperDivs', () => {
    test('adds div.iframe-wrapper tags around iframe tags and returns the result', () => {
      const htmlString = `<div><iframe title="test"></iframe></div>`;
      const expectedResult = `<div><div class="iframe-wrapper"><iframe title="test"></iframe></div></div>`;
      expect(addIframeWrapperDivs(htmlString)).toBe(expectedResult);
    });
  });

  describe('parseIframeHtml', () => {
    test('returns an object with iframe attributes when iframe with attributes is found in input', () => {
      const htmlString = '<div><iframe src="https://google.fi" title="test"></iframe></div>';
      const expectedObj = {src: "https://google.fi", title: "test"};
      expect(parseIframeHtml(htmlString)).toEqual(expectedObj);
    });
    test('returns an empty object if iframe doesnt have any attributes', () => {
      const htmlString = '<div><iframe></iframe></div>';
      expect(parseIframeHtml(htmlString)).toEqual({});
    });
    test('returns an empty object if input doesnt contain iframe elements', () => {
      const htmlString = '<div><p>text</p><figure></figure></div>';
      expect(parseIframeHtml(htmlString)).toEqual({});
    });
  });

  describe('validateIsNotEmpty', () => {
    test('returns false if input is an empty string', () => {
      expect(validateIsNotEmpty('')).toBe(false);
    });
    test('returns true if input is not an empty string', () => {
      expect(validateIsNotEmpty('test')).toBe(true);
    });
  });

  describe('validateIsNumber', () => {
    test('returns false if input contains other than numbers', () => {
      expect(validateIsNumber('123a')).toBe(false);
      expect(validateIsNumber('a123')).toBe(false);
      expect(validateIsNumber('abc')).toBe(false);
      expect(validateIsNumber('987   "#')).toBe(false);
    });
    test('returns true if input contains only numbers', () => {
      expect(validateIsNumber('123')).toBe(true);
      expect(validateIsNumber('1232354')).toBe(true);
    });
    test('returns true if input in an empty string', () => {
      expect(validateIsNumber('')).toBe(true);
    });
  });

  describe('validateInput', () => {
    test('returns an error message string if error is found', () => {
      const inputName = 'src';
      const value = '';
      expect(validateInput(inputName, value)).toBe(IFRAME_VALIDATION.NOT_EMPTY.errorMsg);
    });
    test('returns an empty message string if no errors are found', () => {
      const inputName = 'src';
      const value = 'https://google.fi';
      expect(validateInput(inputName, value)).toBe('');
    });
  });

  describe('validateForm', () => {
    test('returns error messages for all given fields', () => {
      const fields = {src: '', title: '', width: '123', height: 'abc'};
      const expectedResult = {
        src: IFRAME_VALIDATION.NOT_EMPTY.errorMsg,
        title: IFRAME_VALIDATION.NOT_EMPTY.errorMsg,
        width: '',
        height: IFRAME_VALIDATION.ONLY_NUMBERS.errorMsg
      };
      expect(validateForm(fields)).toEqual(expectedResult);
    });
  });

  describe('isFormValid', () => {
    test('returns false if there are input errors', () => {
      const inputErrors = {
        src: IFRAME_VALIDATION.NOT_EMPTY.errorMsg,
        title: IFRAME_VALIDATION.NOT_EMPTY.errorMsg,
        width: '',
        height: IFRAME_VALIDATION.ONLY_NUMBERS.errorMsg,
      };
      expect(isFormValid(inputErrors)).toBe(false);
    });
    test('returns true if there are no input errors', () => {
      const inputErrors = {
        src: '',
        title: '',
        width: '',
        height: '',
      };
      expect(isFormValid(inputErrors)).toBe(true);
    });
  });
});

