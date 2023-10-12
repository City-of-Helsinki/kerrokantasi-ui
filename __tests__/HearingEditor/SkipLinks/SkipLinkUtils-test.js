import { isFormValid } from "../../../src/components/RichTextEditor/SkipLink/SkipLinkUtils";

describe('SkipLinkUtils', () => {
  describe('isFormValid', () => {
    test('returns false when inputErrors object contains any non empty error texts', () => {
      const inputErrors = {
        linkText: "",
        linkOwnId: "error",
        linkTargetId: "error",
      };
      expect(isFormValid(inputErrors)).toBe(false);
    });

    test('returns true when inputErrors object contains only empty error texts', () => {
      const inputErrors = {
        linkText: "",
        linkOwnId: "",
        linkTargetId: "",
      };
      expect(isFormValid(inputErrors)).toBe(true);
    });
  });
});
