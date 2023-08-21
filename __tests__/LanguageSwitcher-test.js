import React from 'react';
import { mount } from 'enzyme';

import { UnconnectedLanguageSwitcher } from "../src/components/Header/LanguageSwitcher";
import getMessage from "../src/utils/getMessage";
import config from "../src/config";

const defaults = {
  currentLanguage: 'fi',
  location: {
    pathname: '/hearingName',
    search: ''
  }
};

const PATH_CURRENT_HEARING_SLUR = '/currentHearingSlug';
const ARIA_EXPANDED = 'aria-expanded';

describe('src/components/Header/LanguageSwitcherV2', () => {
  function getWrapper(props) {
    return mount(<UnconnectedLanguageSwitcher {...defaults} {...props} />);
  }
  function getDropdown(wrapper) {
    wrapper.find('button').at(0).simulate('click'); // opens the dropdown
    return wrapper.find('ul');
  }

  describe('changeLanguage', () => {
    test('is called when changing language', () => {
      const changeLanguageMock = jest.fn();
      const element = getWrapper();
      element.instance().changeLanguage = changeLanguageMock;
      element.instance().forceUpdate();
      const instance = element.instance();
      const spy = jest.spyOn(instance, 'changeLanguage');
      getDropdown(element).find('li').at(0).simulate('click', { preventDefault: () => { } });

      expect(spy).toHaveBeenCalled();
    });

    describe('calls history with correct parameters', () => {
      let mockHistory;

      beforeEach(() => {
        mockHistory = {
          push: jest.fn()
        };
      });

      test('when no url params exist', () => {
        const locationNoParams = {
          pathname: PATH_CURRENT_HEARING_SLUR,
          search: ''
        };
        const element = getWrapper({ location: locationNoParams, history: mockHistory });
        // change language to sv
        getDropdown(element).find('li').at(1).simulate('click', { preventDefault: () => { } });
        expect(mockHistory.push).toHaveBeenCalledWith({
          pathname: locationNoParams.pathname,
          search: `lang=${config.languages[1]}`
        });
      });

      test('when url params exist but not the lang param', () => {
        const locationWithParams = {
          pathname: PATH_CURRENT_HEARING_SLUR,
          search: '?headless=true'
        };
        const element = getWrapper({ location: locationWithParams, history: mockHistory });
        // change language to en
        getDropdown(element).find('li').at(2).simulate('click', { preventDefault: () => { } });
        expect(mockHistory.push).toHaveBeenCalledWith({
          pathname: locationWithParams.pathname,
          search: `${locationWithParams.search}&lang=${config.languages[2]}`
        });
      });

      test('when url param already contains a lang param', () => {
        const locationWithLangParams = {
          pathname: PATH_CURRENT_HEARING_SLUR,
          search: '?preview=OLA9dke-79qqd&lang=fi&headless=true'
        };
        const element = getWrapper({ location: locationWithLangParams, history: mockHistory });
        // change language from fi to en
        getDropdown(element).find('li').at(2).simulate('click', { preventDefault: () => { } });
        expect(mockHistory.push).toHaveBeenCalledWith({
          pathname: locationWithLangParams.pathname,
          search: `?preview=OLA9dke-79qqd&lang=${config.languages[2]}&headless=true`
        });
      });
    });
  });

  describe('handle functions', () => {
    test('handleClick', () => {
      const handleClickMock = jest.fn();
      const element = getWrapper();
      element.instance().handleClick = handleClickMock;
      element.instance().forceUpdate();
      const instance = element.instance();
      const spy = jest.spyOn(instance, 'handleClick');
      instance.handleClick();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('render', () => {
    describe('Button', () => {
      test('has correct props', () => {
        const wrapper = getWrapper();
        const element = wrapper.find('button');
        expect(element.prop(ARIA_EXPANDED)).toBe(false);
        expect(element.prop('aria-haspopup')).toBe('listbox');
        expect(element.prop('onClick')).toBeDefined();
      });

      test('sr only language spans', () => {
        const { languages } = config;
        const languageSpans = getWrapper().find('button').find('span').filter('.sr-only');
        languageSpans.forEach((span, index) => {
          const langCode = languages[index];
          expect(span.prop('className')).toBe('sr-only');
          expect(span.prop('lang')).toBe(langCode);
          expect(span.text()).toBe(
            `, ${getMessage('languageSwitchLabel', langCode)}`
          );
        });
      });

      describe('onClick', () => {
        test('toggleDropdown', () => {
          const element = getWrapper();
          expect(element.find('button').prop(ARIA_EXPANDED)).toBe(false);
          element.find('button').at(0).simulate('click');
          expect(element.find('button').prop(ARIA_EXPANDED)).toBe(true);
          element.find('button').at(0).simulate('click');
          expect(element.find('button').prop(ARIA_EXPANDED)).toBe(false);
        });
      });
    });

    describe('dropdown', () => {
      const { languages } = config;

      test('item count according to config.languages', () => {
        const correctAmount = languages.length;
        const element = getDropdown(getWrapper()).find('li');
        expect(element).toHaveLength(correctAmount);
      });

      test('currentLanguage is selected by default', () => {
        const currentLanguageLabel = getMessage(`lang-${defaults.currentLanguage}`);
        const currentLanguageItem = getDropdown(getWrapper()).find({ label: currentLanguageLabel });
        expect(currentLanguageItem.prop('selected')).toBe(true);
        expect(currentLanguageItem.find('li').prop('aria-selected')).toBe(true);
      });

      test('with correct texts', () => {
        const items = getDropdown(getWrapper()).find('li');
        items.forEach((item, index) => {
          expect(item.text()).toBe(getMessage(`lang-${languages[index]}`));
        });
      });
    });
  });
});
