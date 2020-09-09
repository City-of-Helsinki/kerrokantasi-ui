import getMessage from '../../../utils/getMessage';

// finds <iframe> tags wrapped with <figure> in given input,
// removes the wrapping <figure> tags and returns the result
export function stripWrappingFigureTags(htmlInput) {
  const startRegex = /<figure><iframe/gi;
  const endRegex = /<\/iframe><\/figure>/gi;
  const firstStrip = htmlInput.replace(startRegex, '<iframe');
  const secondStrip = firstStrip.replace(endRegex, '</iframe>');
  return secondStrip;
}

// finds <iframe> tags wrapped with <div class="iframe-wrapper>"> in given input,
// removes the wrapping <div> tags and returns the result
export function stripIframeWrapperDivs(htmlInput) {
  const wrapperRegex = /(<div class="iframe-wrapper"><iframe)([\s\S]*?)(?=<\/iframe>)(<\/iframe><\/div>)/gi;
  const result = htmlInput.replace(wrapperRegex, '<iframe$2</iframe>');
  return result;
}

// adds wrapping <div> tags to all <iframe> tags
export function addIframeWrapperDivs(htmlInput) {
  const startRegex = /<iframe/gi;
  const endRegex = /<\/iframe>/gi;
  const responsiveDiv = '<div class="iframe-wrapper">';
  const firstAddition = htmlInput.replace(startRegex, `${responsiveDiv}<iframe`);
  const secondAddition = firstAddition.replace(endRegex, '</iframe></div>');
  return secondAddition;
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
  const attributeObject = Object.assign({},
    ...Array.from(iframeAttributes, ({name, value}) => ({[name]: value}))
  );

  return attributeObject;
}

// removes width and/or height from attribute style string,
// adds or replaces attribute width and height properties with removed style values
// and returns the resulting attribute object.
export function convertStyleDimensionSettings(attributes) {
  const newAttributes = {...attributes};
  if ("style" in newAttributes) {
    const style = newAttributes.style;
    const widthRegex = /width:\D*(\d+)(?=\D*;)/gi;
    const heightRegex = /height:\D*(\d+)(?=\D*;)/gi;

    const width = widthRegex.exec(style);
    const height = heightRegex.exec(style);

    const widthRemoveRegex = /[ ]*width:\D*\d+(\w*|%);/gi;
    const heightRemoveRegex = /[ ]*height:\D*\d+(\w*|%);/gi;
    newAttributes.style = style.replace(widthRemoveRegex, '').replace(heightRemoveRegex, '');

    if (width) {
      newAttributes.width = width[1];
    }
    if (height) {
      newAttributes.height = height[1];
    }
  }

  return newAttributes;
}

export function validateIsNotEmpty(value) {
  if (!value || value === '') {
    return false;
  }
  return true;
}

export function validateIsNumber(value) {
  const numberRegex = /^[0-9]*$/;
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
  for (let index = 0; index < validationRules.length; index += 1) {
    const rule = IFRAME_VALIDATION[validationRules[index]];
    if (rule.fields.includes(inputName)) {
      if (!rule.isValidFn(value)) {
        return rule.errorMsg;
      }
    }
  }
  return '';
}

// returns error messages for all given fields
export function validateForm(fields) {
  // fields = {fieldName1: value, fieldName2: value,...}
  const inputErrors = {};
  const fieldNames = Object.keys(fields);
  for (let index = 0; index < fieldNames.length; index += 1) {
    const fieldName = fieldNames[index];
    const errorMsg = validateInput(fieldName, fields[fieldName]);
    inputErrors[fieldName] = errorMsg;
  }
  return inputErrors;
}

export function isFormValid(inputErrors) {
  const errorFields = Object.keys(inputErrors);
  for (let index = 0; index < errorFields.length; index += 1) {
    const error = inputErrors[errorFields[index]];
    if (error && error.length > 0) {
      return false;
    }
  }
  return true;
}
