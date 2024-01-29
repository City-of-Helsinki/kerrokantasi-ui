export function isFormValid(inputErrors) {
  const errorValues = Object.keys(inputErrors);
  let isValid = true;


  errorValues.forEach((key) => {
    const error = inputErrors[key];

    if (error) {
      isValid = false;
    }
  })

  return isValid;
}

export default isFormValid;
