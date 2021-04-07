export function isFormValid(inputErrors) {
  const errorValues = Object.values(inputErrors);
  for (let index = 0; index < errorValues.length; index += 1) {
    if (errorValues[index]) {
      return false;
    }
  }

  return true;
}

export default isFormValid;
