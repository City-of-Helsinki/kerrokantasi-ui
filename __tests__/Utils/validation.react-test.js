import validationFunction from '../../src/utils/validation';
import { mockStore } from '../../test-utils';

const { hearing: { mockHearing } } = mockStore;

describe('validateFunction', () => {
  const languages = ['fi', 'sv', 'en'];
  describe('title validation', () => {
    test('returns true if one or more of the titles is empty', () => {
      const titlesMissingEN = { fi: 'otsikko', sv: 'rubrik', en: '' };
      let returnValue = validationFunction.title(titlesMissingEN, languages);
      expect(returnValue).toBe(true);
      titlesMissingEN.sv = '';
      returnValue = validationFunction.title(titlesMissingEN, languages);
      expect(returnValue).toBe(true);
    });
    test('return false if none of the titles are empty', () => {
      const titles = { fi: 'a', sv: 'b', en: 'c' };
      const returnValue = validationFunction.title(titles, languages);
      expect(returnValue).toBe(false);
    });
  });

  describe('labels validation', () => {
    test('returns true/false based on if hearingLabels array is empty', () => {
      expect(validationFunction.labels([])).toBe(true);
    });
    test('returns false if hearingLabels array is not empty', () => {
      expect(validationFunction.labels([{}])).toBe(false);
    });
  });

  describe('slug validation', () => {
    test('return true if hearingSlug is an empty string', () => {
      expect(validationFunction.slug('')).toBe(true);
    });
    test('return false if hearingSlug is not an empty string', () => {
      expect(validationFunction.slug(mockHearing.data.slug)).toBe(false);
    });
  });

  describe('contact persons validation', () => {
    test('return true if contactPersons array is empty', () => {
      expect(validationFunction.contact_persons([])).toBe(true);
    });
    test('return false if contactPersons array is not empty', () => {
      expect(validationFunction.contact_persons(mockHearing.data.contact_persons)).toBe(false);
    });
  });

  describe('open at validation', () => {
    test('return true if prop is false', () => {
      expect(validationFunction.open_at(null)).toBe(true);
    });
    test('return false if prop is not false', () => {
      expect(validationFunction.open_at(mockHearing.data.open_at)).toBe(false);
    });
  });

  describe('close at validation', () => {
    test('return true if prop is false', () => {
      expect(validationFunction.close_at(null)).toBe(true);
    });
    test('return false if prop is not false', () => {
      expect(validationFunction.close_at(mockHearing.data.close_at)).toBe(false);
    });
  });

  describe('project validation', () => {
    describe('project exists validation', () => {
      test('return true if project is not empty', () => {
        expect(validationFunction.project({ id: '11' })).toBe(true);
      });
      test('return false if project is empty', () => {
        expect(validationFunction.project({})).toBe(false);
      });
    });

    describe('project title validation', () => {
      test('return true if one or more language specific title is empty', () => {
        const titlesMissing = { fi: 'otsikko', sv: 'rubrik', en: '' };
        expect(validationFunction.project_title(titlesMissing, languages)).toBe(true);
        titlesMissing.sv = '';
        expect(validationFunction.project_title(titlesMissing, languages)).toBe(true);
      });
      test('return true if a language is missing from titles', () => {
        const titlesMissingFI = { sv: 'rubrik', en: 'header' };
        expect(validationFunction.project_title(titlesMissingFI, languages)).toBe(true);
      });
      test('return false if none of the language specific titles are empty or missing', () => {
        const titles = { fi: 'otsikko', sv: 'rubrik', en: 'header' };
        expect(validationFunction.project_title(titles, languages)).toBe(false);
      });
    });

    describe('project phases title validation', () => {
      let phases;

      beforeEach(() => {
        phases = [
          { title: { fi: 'yksi', sv: 'kaksi', en: 'kolme' } },
          { title: { fi: 'one', sv: 'two', en: 'three' } },
          { title: { fi: 'ett', sv: 'två', en: 'tre' } },
        ];
      });
      test('return true if one or more of the phases contain a language specific title that is empty', () => {
        phases[2].title.en = '';
        expect(validationFunction.project_phases_title(phases, languages)).toBe(true);
        phases[0].title.fi = '';
        expect(validationFunction.project_phases_title(phases, languages)).toBe(true);
      });
      test('return false if none of the phases contain a language specific title that is empty', () => {
        expect(validationFunction.project_phases_title(phases, languages)).toBe(false);
      });
    });

    describe('project phases active validation', () => {
      const phases = [
        { is_active: false },
        { is_active: false },
        { is_active: false },
      ];
      test('return true if none of the phases are active', () => {
        expect(validationFunction.project_phases_active(phases)).toBe(true);
      });
      test('return false if one of the phases are active', () => {
        phases[0].is_active = true;
        expect(validationFunction.project_phases_active(phases)).toBe(false);
      });
    });
  });
});
