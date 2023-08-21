import React from 'react';
import { shallow } from 'enzyme';
import { ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

import { UnconnectedUserProfile } from '../../src/views/UserProfile';
import { getIntlAsProp } from '../../test-utils';
import UserComment from '../../src/components/UserProfile/UserComment';
import HearingCardList from '../../src/components/HearingCardList';
import LoadSpinner from '../../src/components/LoadSpinner';
import Icon from '../../src/utils/Icon';

const createUniqueHearing = (id, slug, title, count, closed, ...props) => ({
  "id": id,
  "commentCount": count,
  "data": {
    "slug": slug,
    "title": {
      "fi": title,
    },
    "closed": closed
  },
  "created_at": "2015-11-16T09:25:37.625607Z",
  ...props
});
const defaultUniqueHearings = [
  createUniqueHearing(
    'hearingOne',
    'slugOne',
    'this str contains a full stop so it will be cut.'.repeat(3),
    1, true),
  createUniqueHearing(
    'hearingTwo',
    'slugTwo',
    'FILLER LOREM IPSUM FILLER. this contains a date near the end so it is sliced 12.12.2020. LOREM IPSUM FILLER.',
    2, false),
  createUniqueHearing(
    'hearingThree',
    'slugThree',
    'this is 88 characters.'.repeat(4),
    3, false),
  createUniqueHearing(
    'hearingFour',
    'slugFour',
    'this is supposed to be a title that is over 100 characters.'.repeat(2),
    1, false),
];
const createComment = (id, hearing, content, ...props) => ({
  "id": id,
  "hearing": hearing,
  "content": content,
  "n_votes": 0,
  "created_by": null,
  "created_at": "2021-11-16T09:25:37.625607Z",
  "answers": [],
  ...props
});
const defaultComments = [
  createComment('1', 'hearingOne', 'first comment'),
  createComment('2', 'hearingTwo', 'second comment'),
  createComment('3', 'hearingTwo', 'third comment'),
  createComment('4', 'hearingThree', 'fourth comment'),
  createComment('5', 'hearingThree', 'fifth comment'),
  createComment('6', 'hearingThree', 'sixth comment'),
  createComment('7', 'hearingFour', 'seventh comment'),
];
const defaultProps = {
  intl: getIntlAsProp(),
  fetchComments: jest.fn(),
  fetchFavorites: jest.fn(),
  removeFromFavorites: jest.fn(),
  user: { favorite_hearings: ['hearingOne', 'someOtherHearing'] },
  userState: {
    userExists: true,
    userLoading: false,
  },
  profile: {
    comments: {
      count: defaultComments.length,
      results: defaultComments,
      uniqueHearings: defaultUniqueHearings
    },
    favoriteHearings: {
      count: 2,
      results: [
        { id: 'firstFavoriteHearing' },
        { id: 'secondFavoriteHearing' }
      ]
    }
  }
};

const commentCounter = (uniqueHearing) => defaultProps.profile.comments.uniqueHearings.find(
  value => value.id === uniqueHearing.id).commentCount;

describe('UserProfile', () => {
  function getWrapper(props) {
    return (shallow(<UnconnectedUserProfile {...defaultProps} {...props} />));
  }
  describe('methods', () => {
    describe('lifecycle', () => {
      describe('componentDidMount', () => {
        test('fetchComments and fetchFavorites are called if userExists && user', () => {
          const wrapper = getWrapper();
          jest.clearAllMocks();
          wrapper.instance().componentDidMount();
          expect(defaultProps.fetchComments).toHaveBeenCalledTimes(1);
          expect(defaultProps.fetchFavorites).toHaveBeenCalledTimes(1);
          expect(defaultProps.fetchFavorites).toHaveBeenCalledWith({ following: true });
        });
        test('fetchComments and fetchFavorites are not called if userExists && user is false', () => {
          const wrapper = getWrapper({ user: null });
          jest.clearAllMocks();
          wrapper.instance().componentDidMount();
          expect(defaultProps.fetchComments).not.toHaveBeenCalled();
          expect(defaultProps.fetchFavorites).not.toHaveBeenCalled();
        });
      });
      describe('componentDidUpdate', () => {
        test('fetchComments & fetchFavorites are called if userState.userLoading changed', () => {
          const wrapper = getWrapper({ user: null, userState: { userLoading: true } });
          jest.clearAllMocks();
          wrapper.instance().componentDidMount();
          expect(defaultProps.fetchComments).not.toHaveBeenCalled();
          expect(defaultProps.fetchFavorites).not.toHaveBeenCalled();
          wrapper.setProps({ userState: { userLoading: false } });
          expect(defaultProps.fetchComments).toHaveBeenCalled();
          expect(defaultProps.fetchFavorites).toHaveBeenCalled();
        });
        test('fetchComments & fetchFavorites are called if props.user changed from previous', () => {
          const wrapper = getWrapper({ user: null });
          jest.clearAllMocks();
          wrapper.instance().componentDidMount();
          expect(defaultProps.fetchComments).not.toHaveBeenCalled();
          expect(defaultProps.fetchFavorites).not.toHaveBeenCalled();
          wrapper.setProps({ user: { id: 'foo' } });
          expect(defaultProps.fetchComments).toHaveBeenCalled();
          expect(defaultProps.fetchFavorites).toHaveBeenCalled();
        });
        test('setCommentCount called and state updated if profile.comments count changed from previous', () => {
          const wrapper = getWrapper();
          const instance = wrapper.instance();
          const mockComments = {
            count: defaultComments.length - 1,
            results: defaultComments.slice(0, -1),
            uniqueHearings: defaultUniqueHearings,
          };
          jest.clearAllMocks();
          instance.componentDidMount();
          const spy = jest.spyOn(instance, 'setCommentCount');
          wrapper.setProps({
            profile: {
              comments: mockComments, favoriteHearings: defaultProps.profile.favoriteHearings
            }
          });
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith(mockComments.count);
        });
        test('fetchFavorites is called if user.favorite_hearings changed from previous', () => {
          const wrapper = getWrapper();
          wrapper.instance().componentDidMount();
          jest.clearAllMocks();
          wrapper.setProps({ user: { favorite_hearings: ['someOtherHearing'] } });
          expect(defaultProps.fetchFavorites).toHaveBeenCalled();
        });
      });
    });
    describe('setSelectedHearing', () => {
      test('updates state with a selectedHearing and its comment count', () => {
        const wrapper = getWrapper();
        // By default selectedHearings is an empty string and commentCount is the length of all comments.
        expect(wrapper.state('selectedHearing')).toEqual('');
        expect(wrapper.state('commentCount')).toBe(defaultComments.length);

        // Loop through all unique hearings, each is selected and test that state is correctly updated.
        defaultUniqueHearings.forEach((hearing) => {
          wrapper.instance().setSelectedHearing(hearing.id);
          expect(wrapper.state('selectedHearing')).toEqual(hearing.id);
          expect(wrapper.state('commentCount')).toBe(commentCounter(hearing));
        });

        // Finally we select 'all' hearing which is an empty string
        wrapper.instance().setSelectedHearing('');
        expect(wrapper.state('selectedHearing')).toEqual('');
        expect(wrapper.state('commentCount')).toBe(defaultComments.length);
      });
    });
    describe('setCommentCount', () => {
      test('sets value to state.commentCount', () => {
        const wrapper = getWrapper();
        expect(wrapper.state('commentCount')).toBe(defaultComments.length);
        wrapper.instance().setCommentCount(99);
        expect(wrapper.state('commentCount')).toBe(99);
        wrapper.instance().setCommentCount(defaultComments.length);
        expect(wrapper.state('commentCount')).toBe(defaultComments.length);
      });
    });
    describe('getUserComments', () => {
      test('returns UserComments for all comments by default (same when all is selected)', () => {
        const { count, results: comments } = defaultProps.profile.comments;
        const wrapper = getWrapper();
        const userCommentsWrapper = shallow(wrapper.instance().getUserComments());
        expect(userCommentsWrapper).toHaveLength(1);
        expect(userCommentsWrapper.find('.commentlist')).toHaveLength(1);
        const commentElements = userCommentsWrapper.find(UserComment);
        expect(commentElements).toHaveLength(count);
        commentElements.forEach((commentElement, index) => {
          expect(commentElement.prop('comment')).toEqual(comments[index]);
        });
      });
      test('return UserComments for a selected hearing', () => {
        const { uniqueHearings, results: comments } = defaultProps.profile.comments;
        const wrapper = getWrapper();
        // Loop through all unique hearings
        uniqueHearings.forEach((hearing) => {
          // Set current hearing as selected
          wrapper.instance().setSelectedHearing(hearing.id);
          const userCommentsWrapper = shallow(wrapper.instance().getUserComments());
          const commentElements = userCommentsWrapper.find(UserComment);
          // UserComment amount is the same as the number of comments that belong to current hearing
          expect(commentElements).toHaveLength(commentCounter(hearing));
          const hearingComments = comments.filter(comment => comment.hearing === hearing.id);
          // Loop through all UserComments and test that it belongs to current hearing
          commentElements.forEach((commentElement, index) => {
            expect(commentElement.prop('comment')).toEqual(hearingComments[index]);
          });
        });
      });
    });
    describe('getHearingCards', () => {
      test('returns HearingCardList with correct props', () => {
        const { profile } = defaultProps;
        const wrapper = getWrapper();

        const localWrapper = shallow(<div>{wrapper.instance().getHearingCards()}</div>);
        const listComponent = localWrapper.find(HearingCardList);
        expect(listComponent).toHaveLength(1);
        expect(listComponent.prop('hearings')).toEqual(profile.favoriteHearings.results);
        expect(listComponent.prop('intl')).toEqual(defaultProps.intl);
        expect(listComponent.prop('language')).toEqual(defaultProps.intl.locale);
        expect(listComponent.prop('className')).toBe('user-favorite');
        expect(listComponent.prop('showCommentCount')).toBe(false);
        expect(listComponent.prop('userProfile')).toBe(true);
        expect(listComponent.prop('unFavoriteAction')).toEqual(defaultProps.removeFromFavorites);
      });
    });
    describe('hearingCommentSelect', () => {
      test('returns FormGroup with correct props and children', () => {
        const outerWrapper = getWrapper();
        const wrapper = shallow(outerWrapper.instance().hearingCommentSelect());
        expect(wrapper.find('.selection-wrappers')).toHaveLength(1);
        const formGroupElement = wrapper.find(FormGroup);
        expect(formGroupElement).toHaveLength(1);
        expect(formGroupElement.prop('controlId')).toBe('hearing-select');
        expect(formGroupElement.children()).toHaveLength(2);
        const labelElement = formGroupElement.find(ControlLabel);
        expect(labelElement).toHaveLength(1);
        expect(labelElement.childAt(0).prop('id')).toBe('selectHearingComments');
        const formControlElement = formGroupElement.find(FormControl);
        expect(formControlElement).toHaveLength(1);
        expect(formControlElement.prop('componentClass')).toBe('select');
        expect(formControlElement.prop('onChange')).toBeDefined();
      });
      describe('FormControl', () => {
        test('has correct amount of options', () => {
          const { comments } = defaultProps.profile;
          const outerWrapper = getWrapper();
          const wrapper = shallow(outerWrapper.instance().hearingCommentSelect());
          const formControlElement = wrapper.find(FormControl);
          expect(formControlElement.children()).toHaveLength(comments.uniqueHearings.length + 1);
          const optionElements = formControlElement.find('option');
          expect(optionElements).toHaveLength(comments.uniqueHearings.length + 1);
        });
        describe('option elements', () => {
          test('do not contain any text that is longer than 100 characters', () => {
            const outerWrapper = getWrapper();
            const wrapper = shallow(outerWrapper.instance().hearingCommentSelect());
            const optionElements = wrapper.find('option');
            optionElements.forEach((option) => {
              expect(option.text().length).toBeLessThan(100);
            });
          });
          test('text is sliced at the last point for hearingOne', () => {
            // Text is sliced at last point if str.length is over 100 and a full stop is between chars 85-100.
            const outerWrapper = getWrapper();
            const wrapper = shallow(outerWrapper.instance().hearingCommentSelect());
            const optionElement = wrapper
              .find('option')
              .filterWhere((option) => option.prop('value') === defaultUniqueHearings[0].id);
            expect(optionElement).toHaveLength(1);
            const optionTextValue = optionElement.text();
            expect(optionTextValue.length).toBeLessThan(100);
            expect(optionTextValue.charAt(optionTextValue.length - 1)).toBe('.');
          });
          test('text is sliced and ellipsis added for hearingTwo', () => {
            // Text is sliced and ellipsis added when str.length is over 100, full stop is between chars 85-100
            // and text contains a date.
            const outerWrapper = getWrapper();
            const wrapper = shallow(outerWrapper.instance().hearingCommentSelect());
            const optionElement = wrapper
              .find('option')
              .filterWhere((option) => option.prop('value') === defaultUniqueHearings[1].id);
            expect(optionElement).toHaveLength(1);
            const optionTextValue = optionElement.text();
            expect(optionTextValue.length).toBeLessThan(100);
            expect(optionTextValue.slice(optionTextValue.length - 3)).toBe('...');
          });
          test('text is not manipulated for hearingThree', () => {
            const outerWrapper = getWrapper();
            const wrapper = shallow(outerWrapper.instance().hearingCommentSelect());
            const optionElement = wrapper
              .find('option')
              .filterWhere((option) => option.prop('value') === defaultUniqueHearings[2].id);
            expect(optionElement).toHaveLength(1);
            expect(optionElement.text().length).toBeLessThan(100);
            expect(optionElement.text()).toEqual(defaultUniqueHearings[2].data.title.fi);
          });
          test('text is sliced and ellipsis added for hearingFour', () => {
            const outerWrapper = getWrapper();
            const wrapper = shallow(outerWrapper.instance().hearingCommentSelect());
            const optionElement = wrapper
              .find('option')
              .filterWhere((option) => option.prop('value') === defaultUniqueHearings[3].id);
            expect(optionElement).toHaveLength(1);
            const optionTextValue = optionElement.text();
            expect(optionTextValue.length).toBeLessThan(100);
            expect(optionTextValue.slice(optionTextValue.length - 3)).toEqual('...');
          });
        });
      });
    });
    describe('getCommentOrderSelect', () => {
      test('returns FormGroup with correct props and children', () => {
        const outerWrapper = getWrapper();
        const localWrapper = shallow(outerWrapper.instance().getCommentOrderSelect());
        expect(localWrapper.find('.order-wrapper')).toHaveLength(1);
        const formGroupElement = localWrapper.find(FormGroup);
        expect(formGroupElement).toHaveLength(1);
        expect(formGroupElement.children()).toHaveLength(2);
        const labelElement = formGroupElement.find(ControlLabel);
        expect(labelElement).toHaveLength(1);
        expect(labelElement.childAt(0).prop('id')).toBe('sort');
        const formControlElement = formGroupElement.find(FormControl);
        expect(formControlElement).toHaveLength(1);
        expect(formControlElement.prop('componentClass')).toBe('select');
        expect(formControlElement.prop('onChange')).toBeDefined();
      });
      test('FormControl has correct amount of children', () => {
        const outerWrapper = getWrapper();
        const localWrapper = shallow(outerWrapper.instance().getCommentOrderSelect());
        const formControlElement = localWrapper.find(FormControl);
        expect(formControlElement.children()).toHaveLength(2);
        expect(formControlElement.childAt(0).prop('id')).toBe('CREATED_AT_DESC');
        expect(formControlElement.childAt(1).prop('id')).toBe('CREATED_AT_ASC');
      });
    });
  });
  describe('renders', () => {
    describe('LoadSpinner when', () => {
      test('userState.userLoading is true', () => {
        const wrapper = getWrapper({ userState: { userLoading: true, userExists: false } });
        expect(wrapper.find(LoadSpinner)).toHaveLength(1);
      });
      test('!user, user is false', () => {
        const wrapper = getWrapper({ user: null });
        expect(wrapper.find(LoadSpinner)).toHaveLength(1);
      });
    });
    describe('Icon with FormattedMessage when', () => {
      test('user has no favorite hearings', () => {
        const favHearingProps = [
          {
            profile:
            {
              comments: defaultProps.profile.comments,
              favoriteHearings: {}
            }
          },
          {
            profile:
            {
              comments: defaultProps.profile.comments,
              favoriteHearings: { count: 0, results: [] }
            }
          }
        ];
        favHearingProps.forEach((prop) => {
          const wrapper = getWrapper(prop);
          const iconElement = wrapper.find(Icon);
          expect(iconElement).toHaveLength(1);
          expect(iconElement.prop('name')).toBe('search');
          expect(iconElement.prop('size')).toBe('2x');
          const messageElement = wrapper.find(FormattedMessage)
            .filterWhere(option => option.prop('id') === 'noFavoriteHearings');
          expect(messageElement).toHaveLength(1);
          expect(messageElement.prop('id')).toBe('noFavoriteHearings');
        });
      });
      test('user has no comments', () => {
        const commentProps = [
          {
            profile:
            {
              comments: {},
              favoriteHearings: defaultProps.profile.favoriteHearings
            }
          },
          {
            profile:
            {
              comments: { ...defaultProps.profile.comments, results: [] },
              favoriteHearings: defaultProps.profile.favoriteHearings
            }
          }
        ];
        commentProps.forEach((prop) => {
          const wrapper = getWrapper(prop);
          const iconElement = wrapper.find(Icon);
          expect(iconElement).toHaveLength(1);
          expect(iconElement.prop('name')).toBe('search');
          expect(iconElement.prop('size')).toBe('2x');
          const messageElement = wrapper.find(FormattedMessage)
            .filterWhere(option => option.prop('id') === 'noAddedComments');
          expect(messageElement).toHaveLength(1);
          expect(messageElement.prop('id')).toBe('noAddedComments');
        });
      });
    });
    describe('main FormattedMessage components', () => {
      test('with correct ids and values if used', () => {
        const wrapper = getWrapper();
        const messageElements = wrapper.find(FormattedMessage);
        expect(messageElements.filterWhere(
          element => element.prop('id') === 'userInfo')
        ).toHaveLength(1);
        expect(messageElements.filterWhere(
          element => element.prop('id') === 'favoriteHearings')
        ).toHaveLength(1);
        const commentsTextElement = messageElements.filterWhere(
          element => element.prop('id') === 'userAddedComments');
        expect(commentsTextElement).toHaveLength(1);
        expect(commentsTextElement.prop('values')).toEqual({ n: wrapper.state('commentCount') });
      });
    });
  });
});
