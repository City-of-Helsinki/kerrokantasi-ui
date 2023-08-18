import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {Button} from 'react-bootstrap';

import {HeaderComponent} from '../../src/components/Hearing/Header';
import {mockStore, getIntlAsProp} from '../../test-utils';
import Icon from '../../src/utils/Icon';

// Renders the Hearings component using enzymes shallow rendering.
// You can pass props you want to override as a parameter.
const setup = propOverrides => {
  const {mockHearingWithSections} = mockStore;
  const props = {hearing: mockHearingWithSections.data,
    sections: mockHearingWithSections.data.sections,
    activeLanguage: 'fi',
    dispatch: () => {},
    location: {
      pathname: mockHearingWithSections.data.sections[0].id
    },
    match: {
      params: {
        sectionId: mockHearingWithSections.data.sections[0].id
      }
    }, ...propOverrides};

  const wrapper = shallow(<HeaderComponent intl={getIntlAsProp()} {...props} />);

  return {
    props,
    wrapper
  };
};

test('Header component should render as expected', () => {
  const {wrapper} = setup();
  const tree = toJson(wrapper);
  expect(tree).toMatchSnapshot();
});
describe('methods', () => {
  describe('getFavorite', () => {
    const {props} = setup();
    const expectedFavoriteValues = {
      // First value if favorite, otherwise second
      icon: ['heart', 'heart-o'],
      click: [props.removeFromFavorites, props.addToFavorites],
      id: ['removeFavorites', 'addFavorites']
    };
    test('returns correct elements when hearing is not in users favorites', () => {
      const {wrapper} = setup({user: {
        id: '123123',
        favorite_hearings: []}
      });
      const elements = shallow(wrapper.instance().getFavorite());
      expect(elements.children()).toHaveLength(2);
      const wrapperContainer = elements.find('div');
      expect(wrapperContainer).toHaveLength(1);
      expect(wrapperContainer.prop('className')).toBe('hearing-meta__element hearing-favorite');
      const iconElement = elements.find(Icon);
      expect(iconElement.prop('name')).toEqual(expectedFavoriteValues.icon[1]);
      const buttonElement = elements.find(Button);
      expect(buttonElement.prop('onClick')).toBeDefined();
      // Only child is FormattedMessage
      expect(buttonElement.childAt(0).prop('id')).toEqual(expectedFavoriteValues.id[1]);
    });

    test('returns correct elements when hearing is in users favorites', () => {
      const {mockHearingWithSections} = mockStore;
      const {wrapper} = setup({user: {
        id: '123123',
        favorite_hearings: [mockHearingWithSections.data.id]}
      });
      const elements = shallow(wrapper.instance().getFavorite());
      expect(elements.children()).toHaveLength(2);
      const iconElement = elements.find(Icon);
      expect(iconElement.prop('name')).toEqual(expectedFavoriteValues.icon[0]);
      const buttonElement = elements.find(Button);
      expect(buttonElement.prop('onClick')).toBeDefined();
      // Only child is FormattedMessage
      expect(buttonElement.childAt(0).prop('id')).toEqual(expectedFavoriteValues.id[0]);
    });

    test('Button onClick calls removeFromFavorites prop when hearing is favorite', () => {
      const mockRemoveFromFavorites = jest.fn();
      const {mockHearingWithSections} = mockStore;
      const {slug: expectedSlug, id: expectedId} = mockHearingWithSections.data;
      const {wrapper} = setup({
        user: {
          id: '123123',
          favorite_hearings: [mockHearingWithSections.data.id]
        },
        removeFromFavorites: mockRemoveFromFavorites,
      });
      const localWrapper = shallow(wrapper.instance().getFavorite());
      localWrapper.find(Button).simulate('click');
      expect(mockRemoveFromFavorites).toHaveBeenCalled();
      expect(mockRemoveFromFavorites).toHaveBeenCalledWith(expectedSlug, expectedId);
    });

    test('Button onClick calls addToFavorites prop when hearing is not favorite', () => {
      const mockAddToFavorites = jest.fn();
      const {mockHearingWithSections} = mockStore;
      const {slug: expectedSlug, id: expectedId} = mockHearingWithSections.data;
      const {wrapper} = setup({
        user: {
          id: '123123',
          favorite_hearings: []
        },
        addToFavorites: mockAddToFavorites,
      });
      const localWrapper = shallow(wrapper.instance().getFavorite());
      localWrapper.find(Button).simulate('click');
      expect(mockAddToFavorites).toHaveBeenCalled();
      expect(mockAddToFavorites).toHaveBeenCalledWith(expectedSlug, expectedId);
    });
  });
});

