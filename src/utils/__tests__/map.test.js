import { getCorrectContrastMapTileUrl } from '../map';

const NORMAL_URL_PNG = "normal url.png";

describe('getCorrectContrastMapTileUrl', () => {
  describe('should return normal map tiles', () => {
    it.skip('when high contrast mode is not enabled', () => {
      const isHighContrastModeEnabled = false;
      const normalMapTileUrl = NORMAL_URL_PNG;
      const highContrastMapTileUrl = "high contrast url.png";
      const language = "fi";
      expect(getCorrectContrastMapTileUrl(
        normalMapTileUrl, highContrastMapTileUrl, isHighContrastModeEnabled, language)).toBe("normal url@fi.png");
    });
    it.skip('when high contrast map tile url doesnt exist', () => {
      const isHighContrastModeEnabled = true;
      const normalMapTileUrl = NORMAL_URL_PNG;
      const highContrastMapTileUrl = undefined;
      const language = "fi";
      expect(getCorrectContrastMapTileUrl(
        normalMapTileUrl, highContrastMapTileUrl, isHighContrastModeEnabled, language)).toBe("normal url@fi.png");
    });
  });

  describe('should return high contrast map tiles', () => {
    it.skip('when high contrast mode is enabled and high contrast map tile url exists', () => {
      const isHighContrastModeEnabled = true;
      const normalMapTileUrl = NORMAL_URL_PNG;
      const highContrastMapTileUrl = "high contrast url.png";
      const language = "fi";

      expect(
        getCorrectContrastMapTileUrl(normalMapTileUrl, highContrastMapTileUrl, isHighContrastModeEnabled, language))
        .toBe("high contrast url@fi.png");
    });
  });
});
