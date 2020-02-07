import React from 'react';

import {UnconnectedLanguageSwitcher} from "../src/components/Header/LanguageSwitcher";
import { Button } from "react-bootstrap";
import { shallow } from 'enzyme';
import getMessage from "../src/utils/getMessage";
import Icon from "../src/utils/Icon";
import config from "../src/config";

const defaults = {
  currentLanguage: 'fi'
};
const classWhenFalse = 'dropdown btn-group';
const classWhenTrue = 'dropdown open btn-group';
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
      element.find('a').at(0).simulate('click', {preventDefault: () => {}});

      expect(spy).toHaveBeenCalled();
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
        const element = getWrapper().find(Button);
        expect(element.prop('className')).toBe('language-switcher');
        expect(element.prop('onClick')).toBeDefined();
        expect(element.prop('aria-label')).toBe(getMessage('languageSwitchLabel'));
        expect(element.prop('id')).toBe('language');
      });

      describe('has correct child', () => {
        test('Icon', () => {
          const element = getWrapper().find(Button).find(Icon);
          expect(element).toHaveLength(1);
          expect(element.prop('name')).toBe('globe');
          expect(element.prop('className')).toBe('user-nav-icon');
          expect(element.prop('aria-hidden')).toBe('true');
        });

        test('text for currentLanguage', () => {
          const element = getWrapper().find(Button).find('span').at(0);
          expect(element.text()).toContain(defaults.currentLanguage);
        });
      });

      describe('onClick', () => {
        test('works and changes div container className', () => {
          const element = getWrapper();
          expect(element.find('div').prop('className')).toBe(classWhenFalse);
          element.find(Button).at(0).simulate('click');
          expect(element.find('div').prop('className')).toBe(classWhenTrue);
          element.find(Button).at(0).simulate('click');
          expect(element.find('div').prop('className')).toBe(classWhenFalse);
        });
      });
    });

    describe('ul element', () => {
      const languages = config.languages;
      function getUL(props) {
        return getWrapper(props).find('ul');
      }

      test('with correct props', () => {
        const element = getUL();
        expect(element.prop('className')).toBe('dropdown-menu dropdown-menu-right');
        expect(element.prop('aria-labelledby')).toBe('language');
      });

      describe('li elements', () => {
        const element = getUL().find('li');
        test('amount according to config.languages', () => {
          const correctAmount = languages.length;
          expect(element).toHaveLength(correctAmount);
        });

        test('with correct className if currentLanguage', () => {
          const elementSV = getWrapper({currentLanguage: languages[1]}).find('li').at(1);
          expect(elementSV.hasClass('active')).toBe(true);
        });

        describe('a elements', () => {
          function getLinkAs(props) {
            return getWrapper(props).find('ul').find('li').find('a');
          }

          test('with correct props', () => {
            const aElements = getLinkAs().at(0);
            const first = aElements;
            expect(first.prop('href')).toBe('#');
            expect(first.prop('aria-label')).toBe(getMessage(`lang-${languages[0]}`));
            expect(first.prop('onClick')).toBeDefined();
          });

          test('with correct texts', () => {
            const aElements = getLinkAs();
            const first = aElements.at(0);
            const second = aElements.at(1);
            expect(first.text()).toBe(getMessage(`lang-${languages[0]}`));
            expect(second.text()).toBe(getMessage(`lang-${languages[1]}`));
          });
        });
      });
    });
  });
});
