import { getCorrectContrastMapTileUrl } from '../src/utils/map';

describe('src/utils/map', () => {
  describe('Returns normal map tiles', () => {
    test.skip('when high contrast mode is not enabled', () => {
      const isHighContrastModeEnabled = false;
      const normalMapTileUrl = "normal url.png";
      const highContrastMapTileUrl = "high contrast url.png";
      const language = "fi";
      expect(getCorrectContrastMapTileUrl(
        normalMapTileUrl, highContrastMapTileUrl, isHighContrastModeEnabled, language)).toBe("normal url@fi.png");
    });
    test.skip('when high contrast map tile url doesnt exist', () => {
      const isHighContrastModeEnabled = true;
      const normalMapTileUrl = "normal url.png";
      const highContrastMapTileUrl = undefined;
      const language = "fi";
      expect(getCorrectContrastMapTileUrl(
        normalMapTileUrl, highContrastMapTileUrl, isHighContrastModeEnabled, language)).toBe("normal url@fi.png");
    });
  });
  describe('Returns high contrast map tiles', () => {
    test.skip('when high contrast mode is enabled and high contrast map tile url exists', () => {
      const isHighContrastModeEnabled = true;
      const normalMapTileUrl = "normal url.png";
      const highContrastMapTileUrl = "high contrast url.png";
      const language = "fi";

      expect(
        getCorrectContrastMapTileUrl(normalMapTileUrl, highContrastMapTileUrl, isHighContrastModeEnabled, language))
        .toBe("high contrast url@fi.png");
    });
  });
});
