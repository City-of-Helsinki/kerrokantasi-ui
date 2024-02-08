import {
  stripWrappingFigureTags,
  stripIframeWrapperDivs,
  addIframeWrapperDivs,
  parseIframeHtml,
  convertStyleDimensionSettings,
  removeCssImportant,
  validateIsNotEmpty,
  validateIsNumber,
  IFRAME_VALIDATION,
  validateInput,
  validateForm,
  isFormValid,
} from '../iframeUtils';

const TEST_URL = "https://google.fi";
const BORDER_NONE = "border: none";

describe('iframeUtils', () => {
  describe('stripWrappingFigureTags', () => {
    it('removes figure tags surrounding iframe tags and returns the result', () => {
      const htmlString = '<div><figure><iframe></iframe></figure><figure><p>text</p></figure></div>';
      const expectedResult = '<div><iframe></iframe><figure><p>text</p></figure></div>';
      expect(stripWrappingFigureTags(htmlString)).toBe(expectedResult);
    });
  });

  describe('stripIframeWrapperDivs', () => {
    it('removes div.iframe-wrapper tags surrounding iframe tags and returns the result', () => {
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
    it('adds div.iframe-wrapper tags around iframe tags and returns the result', () => {
      const htmlString = `<div><iframe title="test"></iframe></div>`;
      const expectedResult = `<div><div class="iframe-wrapper"><iframe title="test"></iframe></div></div>`;
      expect(addIframeWrapperDivs(htmlString)).toBe(expectedResult);
    });
  });

  describe('parseIframeHtml', () => {
    it('returns an object with iframe attributes when iframe with attributes is found in input', () => {
      const htmlString = '<div><iframe src="https://google.fi" title="test"></iframe></div>';
      const expectedObj = { src: TEST_URL, title: "test" };
      expect(parseIframeHtml(htmlString)).toEqual(expectedObj);
    });
    it('returns an empty object if iframe doesnt have any attributes', () => {
      const htmlString = '<div><iframe></iframe></div>';
      expect(parseIframeHtml(htmlString)).toEqual({});
    });
    it('returns an empty object if input doesnt contain iframe elements', () => {
      const htmlString = '<div><p>text</p><figure></figure></div>';
      expect(parseIframeHtml(htmlString)).toEqual({});
    });
  });

  describe('convertStyleDimensionSettings', () => {
    it('returns attribute object where style dimensions are added as their own object properties', () => {
      const attributesA = { title: "test", style: "width: 12px;" };
      const expectedAttributesA = { title: "test", width: "12", style: "" };
      const attributesB = {
        src: TEST_URL,
        title: "test",
        style: "border: none; width: 400px; height: 188px;",
      };
      const expectedAttributesB = {
        src: TEST_URL,
        title: "test",
        width: "400",
        height: "188",
        style: BORDER_NONE,
      };
      expect(convertStyleDimensionSettings(attributesA)).toEqual(expectedAttributesA);
      expect(convertStyleDimensionSettings(attributesB)).toEqual(expectedAttributesB);
    });
    it('replaces current attribute dimension properties with style dimensions', () => {
      const attributes = {
        src: TEST_URL,
        title: "test",
        width: "200",
        height: "150",
        style: "border: none; width: 400px; height: 188px;",
      };
      const expectedAttributes = {
        src: TEST_URL,
        title: "test",
        width: "400",
        height: "188",
        style: BORDER_NONE,
      };
      expect(convertStyleDimensionSettings(attributes)).toEqual(expectedAttributes);
    });
    it('converts correctly with only one given style dimension setting', () => {
      const attributes = {
        src: TEST_URL,
        title: "test",
        width: "200",
        height: "150",
        style: "border: none; width: 400px !important;",
      };
      const expectedAttributes = {
        src: TEST_URL,
        title: "test",
        width: "400",
        height: "150",
        style: BORDER_NONE,
      };
      expect(convertStyleDimensionSettings(attributes)).toEqual(expectedAttributes);
    });
    it('returns copy of original attributes if there are no style dimension settings', () => {
      const attributes = {
        src: TEST_URL,
        title: "test",
        width: "200",
        style: BORDER_NONE,
      };
      const expectedAttributes = {
        src: TEST_URL,
        title: "test",
        width: "200",
        style: BORDER_NONE,
      };
      expect(convertStyleDimensionSettings(attributes)).toEqual(expectedAttributes);
    });
  });

  describe('removeCssImportant', () => {
    it('removes all "!important" substrings from given input string', () => {
      const inputString = `<iframe width="400" height="400"
      style="border:0; width:400px !important; height:400px !important;"
      frameborder="0" src="https://google.fi"></iframe>`;
      const expectedResult = `<iframe width="400" height="400"
      style="border:0; width:400px; height:400px;"
      frameborder="0" src="https://google.fi"></iframe>`;
      expect(removeCssImportant(inputString)).toBe(expectedResult);
    });
  });

  describe('validateIsNotEmpty', () => {
    it('returns false if input is an empty string', () => {
      expect(validateIsNotEmpty('')).toBe(false);
    });
    it('returns true if input is not an empty string', () => {
      expect(validateIsNotEmpty('test')).toBe(true);
    });
  });

  describe('validateIsNumber', () => {
    it('returns false if input contains other than numbers', () => {
      expect(validateIsNumber('123a')).toBe(false);
      expect(validateIsNumber('a123')).toBe(false);
      expect(validateIsNumber('abc')).toBe(false);
      expect(validateIsNumber('987   "#')).toBe(false);
    });
    it('returns true if input contains only numbers', () => {
      expect(validateIsNumber('123')).toBe(true);
      expect(validateIsNumber('1232354')).toBe(true);
    });
    it('returns true if input in an empty string', () => {
      expect(validateIsNumber('')).toBe(true);
    });
  });

  describe('validateInput', () => {
    it('returns an error message string if error is found', () => {
      const inputName = 'src';
      const value = '';
      expect(validateInput(inputName, value)).toBe(IFRAME_VALIDATION.NOT_EMPTY.errorMsg);
    });
    it('returns an empty message string if no errors are found', () => {
      const inputName = 'src';
      const value = 'https://google.fi';
      expect(validateInput(inputName, value)).toBe('');
    });
  });

  describe('validateForm', () => {
    it('returns error messages for all given fields', () => {
      const fields = { src: '', title: '', width: '123', height: 'abc' };
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
    it('returns false if there are input errors', () => {
      const inputErrors = {
        src: IFRAME_VALIDATION.NOT_EMPTY.errorMsg,
        title: IFRAME_VALIDATION.NOT_EMPTY.errorMsg,
        width: '',
        height: IFRAME_VALIDATION.ONLY_NUMBERS.errorMsg,
      };
      expect(isFormValid(inputErrors)).toBe(false);
    });
    it('returns true if there are no input errors', () => {
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

