import finnishTranslations from '../fi.json';
import swedishTranslations from '../sv.json';
import englishTranslations from '../en.json';


describe('Translation files should have matching keys', () => {
    const finnishKeys = Object.keys(finnishTranslations);
    const swedishKeys = Object.keys(swedishTranslations);
    const englishKeys = Object.keys(englishTranslations);
    test('swedish translations has all same keys as finnish translations', () => {
        let missingKeys = finnishKeys.filter(x => !swedishKeys.includes(x));
        expect(missingKeys).toEqual([]);
    })
    test('swedish translations does not have extra keys compared to finnish translations', () => {
        let extraKeys = swedishKeys.filter(x => !finnishKeys.includes(x));
        expect(extraKeys).toEqual([]);
    })
    test('english translations has all same keys as finnish translations', () => {
        let missingKeys = finnishKeys.filter(x => !englishKeys.includes(x));
        expect(missingKeys).toEqual([]);
    })
    test('english translations does not have extra keys compared to finnish translations', () => {
        let extraKeys = englishKeys.filter(x => !finnishKeys.includes(x));
        expect(extraKeys).toEqual([]);
    })
});