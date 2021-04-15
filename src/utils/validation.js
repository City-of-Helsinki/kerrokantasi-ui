import {isEmpty} from "lodash";

export function isUrl(string) {
  try { return Boolean(new URL(string)); } catch (error) { return false; }
}

const validateFunction = {
  /**
   * Returns true if a title is empty
   * @param {object} hearingTitles
   * @param {string[]}languages
   * @returns {boolean}
   */
  title: function title(hearingTitles, languages) {
    /**
     * Array of boolean values according to if title is empty string
     * @type {boolean[]}
     * @example [false, false, true]
     */
    const titlesArray = languages.reduce((acc, curr) => {
      const langTitle = hearingTitles[curr].trim();
      acc.push(langTitle === '');
      return acc;
    }, []);
    return titlesArray.some((value) => value);
  },
  /**
   * Returns true if prop is empty
   * @param {object[]} hearingLabels
   * @returns {boolean}
   */
  labels: function labels(hearingLabels) {
    return isEmpty(hearingLabels);
  },
  /**
   * Returns true if hearingSlug is empty
   * @param {string} hearingSlug
   * @returns {boolean}
   */
  slug: function slug(hearingSlug) {
    const localSlug = hearingSlug.trim();
    return localSlug === '';
  },
  /**
   * Returns true if contactPersons is empty
   * @param {object[]} contactPersons
   * @returns {boolean}
   */
  contact_persons: function contactpersons(contactPersons) {
    return isEmpty(contactPersons);
  },
  /**
   * Returns true if hearingOpenAt is false
   * @param {string} hearingOpenAt
   * @returns {boolean}
   */
  open_at: function openat(hearingOpenAt) {
    return !hearingOpenAt;
  },
  /**
   * Returns true if hearingCloseAt is false
   * @param {string} hearingCloseAt
   * @returns {boolean}
   */
  close_at: function closeat(hearingCloseAt) {
    return !hearingCloseAt;
  },
  /**
   * Returns true if hearingProject is not empty
   * @param {object} hearingProject
   * @returns {boolean}
   */
  project: function project(hearingProject) {
    return !isEmpty(hearingProject);
  },
  /**
   * Returns true if a language specific title is empty
   * @param {object} hearingProjectTitle
   * @param {string[]} languages
   * @returns {boolean}
   */
  project_title: function projecttitle(hearingProjectTitle, languages) {
    /**
     * Array of boolean values according to if title is empty string
     * @type {boolean[]}
     * @example [false, false, true]
     */
    const titlesArray = languages.reduce((acc, curr) => {
      if (hearingProjectTitle[curr]) {
        const langTitle = hearingProjectTitle[curr].trim();
        acc.push(langTitle === '');
      } else {
        acc.push(true);
      }
      return acc;
    }, []);
    return titlesArray.some((value) => value);
  },
  /**
   * Returns true if one of the phases contain a language specific title that is empty.
   * [project_title]{@link project_title} is called for each phase
   * @param {object[]} projectPhases
   * @param {string[]} languages
   * @returns {*}
   */
  project_phases_title: function phasestitle(projectPhases, languages) {
    const phaseTitles = projectPhases.reduce((acc, curr) => {
      acc.push(this.project_title(curr.title, languages));
      return acc;
    }, []);
    return phaseTitles.some((value => value));
  },
  /**
   * Returns true if none of the phases are active
   * @param {object[]} projectPhases
   * @returns {boolean}
   */
  project_phases_active: function phasesactive(projectPhases) {
    return projectPhases.filter(phase => phase.is_active).length <= 0;
  }
};

export default validateFunction;
