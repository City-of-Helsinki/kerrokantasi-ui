import React from 'react';

import {UnconnectedLanguageSwitcher} from "../src/components/Header/LanguageSwitcher";
import { Button } from "react-bootstrap";
import { shallow } from 'enzyme';
import getMessage from "../src/utils/getMessage";
import Icon from "../src/utils/Icon";
import config from "../src/config";

const defaults = {
  currentLanguage: 'fi',
  location: {
    pathname: '/hearingName',
    search: ''
  }
};
const classWhenFalse = 'btn-group';
const classWhenTrue = 'btn-group';
describe('src/components/Header/LanguageSwitcherV2', () => {
  function getWrapper(props) {
    return shallow(<UnconnectedLanguageSwitcher {...defaults} {...props}/>);
  }

  describe('changeLanguage', () => {
    test('is called when changing language', () => {
      const changeLanguageMock = jest.fn();
      const element = getWrapper();
      element.instance().changeLanguage = changeLanguageMock;
      element.instance().forceUpdate();
      const instance = element.instance();
      const spy = jest.spyOn(instance, 'changeLanguage');
      element.find(Button).at(0).simulate('click', {preventDefault: () => {}});

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
          pathname: '/currentHearingSlug',
          search: ''
        };
        const element = getWrapper({location: locationNoParams, history: mockHistory});
        // change language to sv
        element.find(Button).at(1).simulate('click', {preventDefault: () => {}});
        expect(mockHistory.push).toHaveBeenCalledWith({
          pathname: locationNoParams.pathname,
          search: `lang=${config.languages[1]}`
        });
      });
      test('when url params exist but not the lang param', () => {
        const locationWithParams = {
          pathname: '/currentHearingSlug',
          search: '?headless=true'
        };
        const element = getWrapper({location: locationWithParams, history: mockHistory});
        // change language to en
        element.find(Button).at(2).simulate('click', {preventDefault: () => {}});
        expect(mockHistory.push).toHaveBeenCalledWith({
          pathname: locationWithParams.pathname,
          search: locationWithParams.search + `&lang=${config.languages[2]}`
        });
      });
      test('when url param already contains a lang param', () => {
        const locationWithLangParams = {
          pathname: '/currentHearingSlug',
          search: '?preview=OLA9dke-79qqd&lang=fi&headless=true'
        };
        const element = getWrapper({location: locationWithLangParams, history: mockHistory});
        // change language from fi to en
        element.find(Button).at(2).simulate('click', {preventDefault: () => {}});
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

  describe('toggleDropdown', () => {
    test('toggles state.openDropdown', () => {
      const element = getWrapper();
      const instance = element.instance();
      expect(element.state('openDropdown')).toBe(false);
      instance.toggleDropdown();
      expect(element.state('openDropdown')).toBe(true);
    });
  });

  describe('render', () => {
    describe('top div container', () => {
      test('has correct classNames when state.openDropdown is false', () => {
        const element = getWrapper().find('div');
        expect(element.prop('className')).toEqual(classWhenFalse);
      });

      test('has correct classNames when state.openDropdown is true', () => {
        const element = getWrapper().setState({openDropdown: true}).find('div');
        expect(element.prop('className')).toEqual(classWhenTrue);
      });
    });

    describe('Button', () => {
      test('has correct props', () => {
        const element = getWrapper().find(Button).at(0);
        expect(element.prop('className')).toBe('language-button');
        expect(element.prop('onClick')).toBeDefined();
        expect(element.prop('lang')).toBe(getMessage(defaults.currentLanguage));
        expect(element.prop('aria-label')).toBe(getMessage(`lang-${defaults.currentLanguage}`));
      });
    });

    describe('div element', () => {
      const languages = config.languages;
      function getDiv(props) {
        return getWrapper(props).find('div');
      }

      test('with correct props', () => {
        const element = getDiv();
        expect(element.prop('className')).toBe('btn-group');
      });

      describe('button elements', () => {
        const element = getDiv().find(Button);
        test('amount according to config.languages', () => {
          const correctAmount = languages.length;
          expect(element).toHaveLength(correctAmount);
        });

        describe('span elements', () => {
          function getSpanAs() {
            return getWrapper().find('div').find(Button).find('span');
          }

          test('with correct props', () => {
            const spanElements = getSpanAs().at(0);
            const first = spanElements;
            expect(first.text()).toBe(getMessage(languages[0]));
          });
        });
      });
    });
  });
});
