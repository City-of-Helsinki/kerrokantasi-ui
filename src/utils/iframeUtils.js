/* eslint-disable prefer-destructuring */
import { camelCase } from 'lodash';

import getMessage from './getMessage';

// finds <iframe> tags wrapped with <figure> in given input,
// removes the wrapping <figure> tags and returns the result
export function stripWrappingFigureTags(htmlInput) {
  const startRegex = /<figure><iframe/gi;
  const endRegex = /<\/iframe><\/figure>/gi;
  const firstStrip = htmlInput.replace(startRegex, '<iframe');

  return firstStrip.replace(endRegex, '</iframe>');
}

// finds <iframe> tags wrapped with <div class="iframe-wrapper>"> in given input,
// removes the wrapping <div> tags and returns the result
export function stripIframeWrapperDivs(htmlInput) {
  const wrapperRegex = /(<div class="iframe-wrapper"><iframe)([\s\S]*?)(?=<\/iframe>)(<\/iframe><\/div>)/gi;

  return htmlInput.replace(wrapperRegex, '<iframe$2</iframe>');
}

// adds wrapping <div> tags to all <iframe> tags
export function addIframeWrapperDivs(htmlInput) {
  const startRegex = /<iframe/gi;
  const endRegex = /<\/iframe>/gi;
  const responsiveDiv = '<div class="iframe-wrapper">';
  const firstAddition = htmlInput.replace(startRegex, `${responsiveDiv}<iframe`);

  return firstAddition.replace(endRegex, '</iframe></div>');
}

// returns an object with iframe attributes
// or empty object if no iframes with attributes are found
export function parseIframeHtml(htmlInput) {
  const temp = document.createElement("div");
  temp.innerHTML = htmlInput;
  const iframeElements = temp.getElementsByTagName('iframe');

  if (!iframeElements || iframeElements.length <= 0 || iframeElements[0].attributes.length <= 0) {
    return {};
  }

  const iframeAttributes = iframeElements[0].attributes;

  return Object.assign({},
    ...Array.from(iframeAttributes, ({ name, value }) => ({ [name]: value }))
  );
}

export function removeCssImportant(cssString) {
  const importantRemoveRegex = / !important/gi;
  return cssString.replace(importantRemoveRegex, '');
}

// removes width and/or height from attribute style string,
// adds or replaces attribute width and height properties with removed style values
// and returns the resulting attribute object.
export function convertStyleDimensionSettings(attributes) {
  const newAttributes = { ...attributes };
  if ("style" in newAttributes) {
    const styleString = newAttributes.style;
    const styleObj = {};

    styleString.split(';').forEach((item) => {
      const [property, value] = item.split(':');

      if (!property) return;

      const formatted = camelCase(property.trim());

      styleObj[formatted] = value.trim();
    });

    const setWidth = parseInt(styleObj.width, 10);
    const setHeight = parseInt(styleObj.height, 10);

    if (setWidth) {
      newAttributes.width = setWidth.toString();
    }

    if (setHeight) {
      newAttributes.height = setHeight.toString();
    }

    delete styleObj.width;
    delete styleObj.height;

    const newStyleString = Object.entries(styleObj).map(([key, value]) => `${key}: ${value}`).join(';');

    newAttributes.style = newStyleString;
  }

  return newAttributes;
}



export function validateIsNotEmpty(value) {
  return !(!value || value === '');
}

export function validateIsNumber(value) {
  const numberRegex = /^\d*$/;
  return numberRegex.test(value);
}

export const IFRAME_VALIDATION = {
  NOT_EMPTY: {
    fields: ['title', 'src'],
    errorMsg: getMessage('validationCantBeEmpty'),
    isValidFn: validateIsNotEmpty,
  },
  ONLY_NUMBERS: {
    fields: ['width', 'height'],
    errorMsg: getMessage('validationOnlyNumbers'),
    isValidFn: validateIsNumber,
  }
};

// returns an error message string if error is found or
// empty string if no errors are found
export function validateInput(inputName, value) {
  const validationRules = Object.keys(IFRAME_VALIDATION);

  const errorMessages = validationRules
    .map((key) => IFRAME_VALIDATION[key])
    .filter((rule) => rule.fields.includes(inputName) && !rule.isValidFn(value))
    .map((rule) => rule.errorMsg);

  if (errorMessages.length) {
    return errorMessages[0];
  }

  return '';
}

// returns error messages for all given fields
export function validateForm(fields) {
  const inputErrors = {};
  const fieldNames = Object.keys(fields);

  fieldNames.forEach((fieldName) => {
    const errorMsg = validateInput(fieldName, fields[fieldName]);

    inputErrors[fieldName] = errorMsg;
  });

  return inputErrors;
}

export function isFormValid(inputErrors) {
  const errorFields = Object.keys(inputErrors);
  let isValid = true;


  errorFields.forEach((key) => {
    const error = inputErrors[key];

    if (error && error.length > 0) {
      isValid = false;
    }
  })

  return isValid;
}
