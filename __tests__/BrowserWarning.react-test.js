import React from 'react';
import { shallow } from 'enzyme';
import { Helmet } from 'react-helmet';

import BrowserWarning from "../src/views/BrowserWarning";

const BROWSER_WARING_CONTAINER_CLASS = '.browser-warning-text-container';

describe('src/views/BrowserWarning', () => {
  function getWrapper() {
    return shallow(<BrowserWarning />);
  }
  describe('contains', () => {
    test('Helmet', () => {
      const helmet = getWrapper().find(Helmet);
      expect(helmet).toHaveLength(1);
    });
    test('Helmet title', () => {
      const helmet = getWrapper().find(Helmet);
      const title = helmet.find('title');
      expect(title).toHaveLength(1);
      expect(title.text()).toBe("Kerrokantasi");
    });
    test('h1 heading', () => {
      const heading = getWrapper().find('h1');
      expect(heading).toHaveLength(1);
      expect(heading.text()).toBe("Kerrokantasi");
    });
    test('correct amount of text containers, 1 for each language so 3 in total', () => {
      const element = getWrapper();
      const textContainers = element.find(BROWSER_WARING_CONTAINER_CLASS);
      expect(element).toHaveLength(1);
      expect(textContainers).toHaveLength(3);
    });
    test('2 p elements per language', () => {
      const textContainers = getWrapper().find(BROWSER_WARING_CONTAINER_CLASS);
      const finnishTexts = textContainers.at(0).find('p');
      const swedishTexts = textContainers.at(1).find('p');
      const englishTexts = textContainers.at(2).find('p');

      expect(finnishTexts).toHaveLength(2);
      expect(swedishTexts).toHaveLength(2);
      expect(englishTexts).toHaveLength(2);
    });
    test('3 links per language', () => {
      const textContainers = getWrapper().find(BROWSER_WARING_CONTAINER_CLASS);
      const finnishLinks = textContainers.at(0).find('a');
      const swedishLinks = textContainers.at(1).find('a');
      const englishLinks = textContainers.at(2).find('a');

      expect(finnishLinks).toHaveLength(3);
      expect(swedishLinks).toHaveLength(3);
      expect(englishLinks).toHaveLength(3);
    });
  });
});
