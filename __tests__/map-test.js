import { getCorrectContrastMapTileUrl } from '../src/utils/map';

describe('src/utils/map', () => {
  describe('Returns normal map tiles', () => {
    test('when high contrast mode is not enabled', () => {
      const isHighContrastModeEnabled = false;
      const normalMapTileUrl = "normal url";
      const highContrastMapTileUrl = "high contrast url";
      expect(getCorrectContrastMapTileUrl(
        normalMapTileUrl, highContrastMapTileUrl, isHighContrastModeEnabled)).toBe(normalMapTileUrl);
    });
    test('when high contrast map tile url doesnt exist', () => {
      const isHighContrastModeEnabled = true;
      const normalMapTileUrl = "normal url";
      const highContrastMapTileUrl = undefined;
      expect(getCorrectContrastMapTileUrl(
        normalMapTileUrl, highContrastMapTileUrl, isHighContrastModeEnabled)).toBe(normalMapTileUrl);
    });
  });
  describe('Returns high contrast map tiles', () => {
    test('when high contrast mode is enabled and high contrast map tile url exists', () => {
      const isHighContrastModeEnabled = true;
      const normalMapTileUrl = "normal url";
      const highContrastMapTileUrl = "high contrast url";
      expect(getCorrectContrastMapTileUrl(
        normalMapTileUrl, highContrastMapTileUrl, isHighContrastModeEnabled)).toBe(highContrastMapTileUrl);
    });
  });
});
