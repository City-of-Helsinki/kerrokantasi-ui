import React from 'react';
import { shallow } from "enzyme";
import { FormattedMessage } from "react-intl";
import { Button } from "react-bootstrap";

import { UnconnectedUserHearings, GET_HEARINGS, SEARCH_PARAMS } from "../src/views/UserHearings";
import { getIntlAsProp, mockStore, mockUser } from "../test-utils";
import HearingCard from "../src/components/HearingCard";
import LoadSpinner from "../src/components/LoadSpinner";
import Icon from "../src/utils/Icon";
import { getUserHearingList } from "../src/selectors/hearing";


const mockState = mockStore;
const mockLoggedUser = mockUser;
mockLoggedUser.adminOrganizations = ['usersOrganization'];
const defaultProps = {
  user: mockLoggedUser,
  userState: { userExists: true, userLoading: false },
  fetching: getUserHearingList(mockState, 'isFetching'),
  fetchHearingList: jest.fn(),
  hearingCount: getUserHearingList(mockState, 'count'),
  hearingData: getUserHearingList(mockState, 'data'),
};
const HEARING_KEYS = Object.keys(GET_HEARINGS);
describe('UserHearings', () => {
  function getWrapper(props) {
    return shallow(<UnconnectedUserHearings intl={getIntlAsProp()} {...defaultProps} {...props} />);
  }
  describe('methods', () => {
    describe('lifecycle methods', () => {
      describe('componentDidMount', () => {
        test('calls fetchAllHearings if userExists && user is true', () => {
          const wrapper = getWrapper();
          wrapper.instance().fetchAllHearings = jest.fn();
          wrapper.instance().forceUpdate();
          const instance = wrapper.instance();
          const spy = jest.spyOn(instance, 'fetchAllHearings');

          instance.componentDidMount();
          expect(spy).toHaveBeenCalled();
        });

        test('does not call fetchAllHearings if userExists && user is false', () => {
          const wrapper = getWrapper({ userState: { userExists: false, userLoading: false } });
          wrapper.instance().fetchAllHearings = jest.fn();
          wrapper.instance().forceUpdate();
          const instance = wrapper.instance();
          const spy = jest.spyOn(instance, 'fetchAllHearings');

          instance.componentDidMount();
          expect(spy).not.toHaveBeenCalled();
        });
      });

      describe('componentDidUpdate', () => {
        test('calls fetchAllHearings if !prevProps.user && this.props.user', () => {
          const wrapper = getWrapper({ user: null, userState: { userExists: false, userLoading: false } });
          wrapper.instance().fetchAllHearings = jest.fn();
          wrapper.instance().forceUpdate();
          const instance = wrapper.instance();
          const spy = jest.spyOn(instance, 'fetchAllHearings');

          wrapper.setProps({ user: defaultProps.user, userState: { userExists: true, userLoading: false } });
          expect(spy).toHaveBeenCalled();
        });

        describe('calls fetchAllHearings ', () => {
          let wrapper;
          let instance;
          let spy;
          beforeEach(() => {
            wrapper = getWrapper();
            wrapper.instance().fetchAllHearings = jest.fn();
            wrapper.instance().forceUpdate();
            instance = wrapper.instance();
            spy = jest.spyOn(instance, 'fetchAllHearings');
          });

          test('if state.loadOwn changes', () => {
            expect(wrapper.state('loadOwn')).toBe(true);

            // toggle from true -> false
            instance.toggleHearingCreator();
            expect(spy).toHaveBeenCalledTimes(1);
            expect(wrapper.state('loadOwn')).toBe(false);

            spy.mockReset();
            // toggle from false -> true
            instance.toggleHearingCreator();
            expect(spy).toHaveBeenCalledTimes(1);
            expect(wrapper.state('loadOwn')).toBe(true);
          });

          test('if state.sortHearingsBy changes', () => {
            expect(wrapper.state('sortHearingsBy')).toBe('-created_at');
            instance.changeSort({ target: { value: 'open_at' } });
            expect(spy).toHaveBeenCalledTimes(1);
            expect(wrapper.state('sortHearingsBy')).toBe('open_at');

            spy.mockReset();

            instance.changeSort({ target: { value: 'close_at' } });
            expect(spy).toHaveBeenCalledTimes(1);
            expect(wrapper.state('sortHearingsBy')).toBe('close_at');
          });
        });
      });
    });
    describe('toggle/set methods', () => {
      let wrapper;
      let instance;

      beforeEach(() => {
        wrapper = getWrapper();
        instance = wrapper.instance();
      });

      test('changeSort updates state.sortHearingsBy', () => {
        expect(wrapper.state('sortHearingsBy')).toBe('-created_at');
        instance.changeSort({ target: { value: 'close_at' } });
        expect(wrapper.state('sortHearingsBy')).toBe('close_at');
        instance.changeSort({ target: { value: 'open_at' } });
        expect(wrapper.state('sortHearingsBy')).toBe('open_at');
      });

      test('toggleHearingCreator toggles state.loadOwn', () => {
        expect(wrapper.state('loadOwn')).toBe(true);
        instance.toggleHearingCreator();
        expect(wrapper.state('loadOwn')).toBe(false);
        instance.toggleHearingCreator();
        expect(wrapper.state('loadOwn')).toBe(true);
      });

      test('toggleDropdown toggles state.openTools', () => {
        expect(wrapper.state('openTools')).toBe(false);
        instance.toggleDropdown();
        expect(wrapper.state('openTools')).toBe(true);
        instance.toggleDropdown();
        expect(wrapper.state('openTools')).toBe(false);
      });
    });
    describe('hearing fetch methods', () => {
      describe('fetchAllHearings', () => {
        test('calls fetchHearing 4 times with correct parameters', () => {
          const wrapper = getWrapper();
          wrapper.instance().fetchHearing = jest.fn();
          wrapper.instance().forceUpdate();
          const instance = wrapper.instance();
          const spy = jest.spyOn(instance, 'fetchHearing');
          const defaultParams = instance.getDefaultParams();

          instance.fetchAllHearings();
          expect(spy).toHaveBeenCalledTimes(4);
          HEARING_KEYS.forEach((key, index) => {
            const specificParams = SEARCH_PARAMS[key];
            const listID = GET_HEARINGS[key];
            expect(spy.mock.calls[index]).toEqual([listID, { ...specificParams, ...defaultParams }]);
          });
        });
      });
      describe('fetchHearing', () => {
        test('calls fetchHearingList', () => {
          const mockFetchHearingList = jest.fn();
          const wrapper = getWrapper({ fetchHearingList: mockFetchHearingList });
          const instance = wrapper.instance();

          mockFetchHearingList.mockReset();

          HEARING_KEYS.forEach((key) => {
            const listID = GET_HEARINGS[key];
            const params = SEARCH_PARAMS[key];
            instance.fetchHearing(listID, params);
            expect(mockFetchHearingList).toHaveBeenCalled();
            expect(mockFetchHearingList).toHaveBeenCalledWith(listID, '/v1/hearing/', params);
            mockFetchHearingList.mockReset();
          });
        });
      });

      describe('getRemainingHearings', () => {
        test('calls fetchHearing with correct parameters', () => {
          const wrapper = getWrapper();
          wrapper.instance().fetchHearing = jest.fn();
          wrapper.instance().forceUpdate();
          const instance = wrapper.instance();
          const spy = jest.spyOn(instance, 'fetchHearing');
          HEARING_KEYS.forEach((key) => {
            const listID = GET_HEARINGS[key];
            const specificParams = SEARCH_PARAMS[key];
            const defaultParams = instance.getDefaultParams();
            delete specificParams.limit;
            instance.getRemainingHearings(key);
            expect(spy).toHaveBeenCalledWith(listID, { ...specificParams, ...defaultParams });
            spy.mockReset();
          });
        });
      });
    });
    describe('hearing list/card methods', () => {
      describe('getHearingListing', () => {
        test('returns LoadSpinner if type isFetching', () => {
          const wrapper = getWrapper({ fetching: { open: true, queue: true, closed: true, draft: true } });
          HEARING_KEYS.forEach((key) => {
            const keyType = key.toLowerCase();
            const element = wrapper.instance().getHearingListing(keyType);
            expect(element).toEqual(<LoadSpinner />);
          });
        });

        test('returns Icon with FormattedMessage if 0 hearings for type', () => {
          const foo = { ...defaultProps.hearingData };
          foo.draft = [];
          const wrapper = getWrapper({ hearingData: foo });
          const elementWrapper = shallow(wrapper.instance().getHearingListing('draft'));
          const iconElement = elementWrapper.find(Icon);
          const messageElement = elementWrapper.find(FormattedMessage);
          expect(iconElement).toHaveLength(1);
          expect(iconElement.prop('name')).toBe('search');
          expect(messageElement).toHaveLength(1);
          expect(messageElement.prop('id')).toBe('noHearings');
        });

        test('returns one HearingCard per hearing', () => {
          const wrapper = getWrapper();
          HEARING_KEYS.forEach((key) => {
            const keyType = key.toLowerCase();
            const bar = shallow(wrapper.instance().getHearingListing(keyType));
            const expectedCount = defaultProps.hearingData[keyType].length;
            expect(bar.find(HearingCard)).toHaveLength(expectedCount);
          });
        });

        test('returns HearingCards plus a Button if hearingCount is over 4', () => {
          const wrapper = getWrapper();
          const elementWrapper = shallow(wrapper.instance().getHearingListing('open'));
          const expectedCount = defaultProps.hearingData.open.length;
          expect(elementWrapper.find(HearingCard)).toHaveLength(expectedCount);
          expect(elementWrapper.find(Button)).toHaveLength(1);

          const messageElement = elementWrapper.find(FormattedMessage);
          expect(messageElement).toHaveLength(1);
          expect(messageElement.prop('id')).toBe('showAll');
          expect(messageElement.prop('values')).toEqual({ n: defaultProps.hearingCount.open });
        });
      });
      describe('getHearingCards', () => {
        test('returns an array of HearingCards ', () => {
          const wrapper = getWrapper();
          const elements = wrapper.instance().getHearingCards(defaultProps.hearingData.open);
          const cardWrapper = shallow(<div>{elements}</div>);
          expect(elements).toHaveLength(defaultProps.hearingData.open.length);
          expect(cardWrapper.find(HearingCard)).toHaveLength(defaultProps.hearingData.open.length);
        });
      });
      describe('getHearingHeader', () => {
        test('return FormattedMessage with correct parameters', () => {
          const wrapper = getWrapper();
          HEARING_KEYS.forEach((key) => {
            const keyType = key.toLowerCase();
            const messageWrapper = shallow(
              // eslint-disable-next-line react/no-unknown-property
              <div intl={getIntlAsProp()}>{wrapper.instance().getHearingHeader(keyType)}</div>
            );
            const messageElement = messageWrapper.find(FormattedMessage);
            expect(messageElement).toHaveLength(1);
            expect(messageElement.prop('id')).toBe(`${keyType}Count`);
            const expectedValues = { n: defaultProps.hearingCount[keyType] };
            expect(messageElement.prop('values')).toEqual(expectedValues);
          });
        });
      });
    });
  });
});
