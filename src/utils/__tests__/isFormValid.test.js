import { isFormValid } from "../isFormValid";

describe('SkipLinkUtils', () => {
  it('should return false when inputErrors object contains any non empty error texts', () => {
    const inputErrors = {
      linkText: "",
      linkOwnId: "error",
      linkTargetId: "error",
    };
    expect(isFormValid(inputErrors)).toBe(false);
  });

  it('should return true when inputErrors object contains only empty error texts', () => {
    const inputErrors = {
      linkText: "",
      linkOwnId: "",
      linkTargetId: "",
    };
    expect(isFormValid(inputErrors)).toBe(true);
  });
});

