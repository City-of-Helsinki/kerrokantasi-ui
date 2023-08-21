import React from 'react';
import { shallow } from "enzyme";
import { Button, Label, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import moment from 'moment';

import { getIntlAsProp } from '../../test-utils';
import UserComment from '../../src/components/UserProfile/UserComment';
import Icon from '../../src/utils/Icon';
import Link from '../../src/components/LinkWithLang';
import HearingMap from '../../src/components/Hearing/HearingMap';


const defaultCommentData = {
  author: 'DefaultUser',
  created_at: new Date('10 September 2021 12:30').toISOString(),
  closed: false,
  deleted: false,
  deletedAt: null,
  deletedByType: null,
  slug: 'hearingSlug',
  content: 'is this working?',
  geojson: null
};

const mockComment = (
  props = {}
) => ({
  author_name: props.author || defaultCommentData.author,
  created_at: defaultCommentData.created_at,
  deleted: props.deleted || defaultCommentData.deleted,
  deleted_at: props.deletedAt || defaultCommentData.deletedAt,
  deleted_by_type: props.deletedByType || defaultCommentData.deletedByType,
  hearing_data: {
    closed: props.closed || defaultCommentData.closed,
    slug: props.slug || defaultCommentData.slug,
  },
  content: props.content || defaultCommentData.content,
  geojson: props.geojson || defaultCommentData.geojson
});
const defaultProps = {
  comment: mockComment(),
};

const HEARING_COMMENT_BODY_CLASS = 'div.hearing-comment-body';
const HEARING_MAP_CONTAINER_CLASS = '.hearing-comment__map-container';
const ARIA_EXPANDED = 'aria-expanded';

describe('UserComment', () => {
  function getWrapper(props) {
    return (shallow(<UserComment intl={getIntlAsProp()} {...defaultProps} {...props} />));
  }
  describe('renders', () => {
    describe('elements inside .hearing-comment-publisher container', () => {
      const expectedValue = { author: 'ConcernedCitizen' };
      let wrapper;
      let containerElement;
      beforeEach(() => {
        wrapper = getWrapper({ comment: mockComment(expectedValue) });
        containerElement = wrapper.find('.hearing-comment-publisher');
      });

      test('.hearing-comment-user contains correct elements', () => {
        expect(containerElement).toHaveLength(1);
        // span.hearing-comment-user
        const userElement = containerElement.find('.hearing-comment-user');
        expect(userElement).toHaveLength(1);
        expect(userElement.find(Icon)).toHaveLength(1);
        expect(userElement.text()).toBe(`<Icon />${expectedValue.author}`);
      });

      test('OverlayTrigger with correct props and children', () => {
        const expectedOverlayProp = wrapper.instance().dateTooltip(defaultCommentData.created_at);
        expect(containerElement).toHaveLength(1);

        // <OverlayTrigger ... />
        const triggerElement = containerElement.find(OverlayTrigger);
        expect(triggerElement).toHaveLength(1);
        expect(triggerElement.prop('overlay')).toEqual(expectedOverlayProp);

        // span.hearing-comment-date
        const spanElement = containerElement.find('.hearing-comment-date');
        expect(spanElement).toHaveLength(1);

        // <FormattedRelative ... />
        const creationDateElement = spanElement.find(FormattedRelative);
        expect(creationDateElement).toHaveLength(1);
        expect(creationDateElement.prop('value')).toBe(defaultCommentData.created_at);
      });
    });
    describe('div.hearing-comment-status', () => {
      const commentProps = [
        { comment: { closed: false, slug: 'openHearingSlug' }, style: 'success', id: 'openHearing' },
        { comment: { closed: true, slug: 'closedHearingSlug' }, style: 'default', id: 'closedHearing' },
      ];
      test('Icon and FormattedMessage components with correct props based on if hearing is open or not', () => {
        commentProps.forEach((prop) => {
          const wrapper = getWrapper({ comment: mockComment(prop.comment) });
          // div.hearing-comment-status
          const containerElement = wrapper.find('.hearing-comment-status');
          expect(containerElement).toHaveLength(1);

          // Label
          const labelElement = containerElement.find(Label);
          expect(labelElement).toHaveLength(1);
          expect(labelElement.prop('bsStyle')).toEqual(prop.style);

          // FormattedMessage components
          const messageElement = labelElement.find(FormattedMessage);
          expect(messageElement).toHaveLength(2);
          expect(messageElement.at(0).prop('id')).toBe('commentHearingStatus');
          expect(messageElement.at(1).prop('id')).toBe(prop.id);

          // Link
          const linkElement = containerElement.find(Link);
          expect(linkElement).toHaveLength(1);
          expect(linkElement.prop('to')).toEqual({ "path": `/${prop.comment.slug}` });
        });
      });
    });
    describe('hearing comment body', () => {
      test('contains correct text from comment.content', () => {
        const wrapper = getWrapper();
        const element = wrapper.find(HEARING_COMMENT_BODY_CLASS);
        expect(element).toHaveLength(1);
        expect(element.text()).toEqual(defaultCommentData.content);
      });

      describe('when comment is deleted', () => {
        const deleted = true;
        const deletedAt = '2022-01-31T09:45:00.284857Z';
        const deletedByTypes = { moderator: 'moderator', self: 'self' };

        test('by self', () => {
          const comment = mockComment({ deleted, deletedAt, deletedByType: deletedByTypes.self });
          const wrapper = getWrapper({ comment });
          const element = wrapper.find(HEARING_COMMENT_BODY_CLASS).find(FormattedMessage);
          expect(element).toHaveLength(1);
          expect(element.prop('id')).toBe('sectionCommentSelfDeletedMessage');
        });

        test('by moderator', () => {
          const comment = mockComment({ deleted, deletedAt, deletedByType: deletedByTypes.moderator });
          const wrapper = getWrapper({ comment });
          const element = wrapper.find(HEARING_COMMENT_BODY_CLASS).find(FormattedMessage);
          expect(element).toHaveLength(1);
          expect(element.prop('id')).toBe('sectionCommentDeletedMessage');
          expect(element.prop('values')).toEqual({
            date:
              moment(new Date(deletedAt)).format(' DD.MM.YYYY HH:mm')
          });
        });

        test('by unknown type', () => {
          const comment = mockComment({ deleted, deletedAt });
          const wrapper = getWrapper({ comment });
          const element = wrapper.find(HEARING_COMMENT_BODY_CLASS).find(FormattedMessage);
          expect(element).toHaveLength(1);
          expect(element.prop('id')).toBe('sectionCommentGenericDeletedMessage');
        });
      });
    });
    describe('comment contains geojson data', () => {
      test('certain elements arent rendered if comment doesnt have geojson', () => {
        const wrapper = getWrapper();
        expect(wrapper.find('.hearing-comment__map')).toHaveLength(0);
        expect(wrapper.find(HEARING_MAP_CONTAINER_CLASS)).toHaveLength(0);
        expect(wrapper.find(Button)).toHaveLength(0);
        expect(wrapper.find(HearingMap)).toHaveLength(0);
      });
      test('map toggle button is rendered if comment has geojson', () => {
        const geojsonValues = { geojson: { type: 'Point', coordinates: [22.254456, 60.459252] } };
        const wrapper = getWrapper({ comment: mockComment(geojsonValues) });
        let toggleButton = wrapper.find(Button);
        expect(toggleButton).toHaveLength(1);
        expect(toggleButton.prop('className')).toEqual('hearing-comment__map-toggle');
        expect(toggleButton.prop('onClick')).toBeDefined();
        // <FormattedMessage ... />
        expect(toggleButton.childAt(0).prop('id')).toBe('commentShowMap');

        // aria-expanded value changes between true/false when clicked
        expect(toggleButton.prop(ARIA_EXPANDED)).toBe(false);
        toggleButton.simulate('click');
        toggleButton = wrapper.find(Button);
        expect(toggleButton.prop(ARIA_EXPANDED)).toBe(true);
        toggleButton.simulate('click');
        toggleButton = wrapper.find(Button);
        expect(toggleButton.prop(ARIA_EXPANDED)).toBe(false);
      });
      describe('map-container and HearingMap', () => {
        test('are rendered based on state.displayMap', () => {
          const geojsonValues = { geojson: { type: 'Point', coordinates: [22.254456, 60.459252] } };
          const wrapper = getWrapper({ comment: mockComment(geojsonValues) });
          expect(wrapper.find(HEARING_MAP_CONTAINER_CLASS)).toHaveLength(0);
          expect(wrapper.find(HearingMap)).toHaveLength(0);
          wrapper.find(Button).simulate('click');
          expect(wrapper.find(HEARING_MAP_CONTAINER_CLASS)).toHaveLength(1);
          expect(wrapper.find(HearingMap)).toHaveLength(1);
        });
        test('HearingMap is called with correct props', () => {
          const geojsonValues = { geojson: { type: 'Point', coordinates: [22.254456, 60.459252] } };
          const wrapper = getWrapper({ comment: mockComment(geojsonValues) });
          wrapper.find(Button).simulate('click');
          const mapElement = wrapper.find(HearingMap);
          expect(mapElement.prop('hearing')).toEqual(geojsonValues);
          expect(mapElement.prop('mapContainer')).toEqual(wrapper.state('mapContainer'));
          expect(mapElement.prop('mapSettings')).toEqual({ dragging: false });
        });
      });
    });
  });
  describe('methods', () => {
    test('toggleMap toggles state.displayMap', () => {
      const geojsonValues = { geojson: { type: 'Point', coordinates: [22.254456, 60.459252] } };
      const wrapper = getWrapper({ comment: mockComment(geojsonValues) });
      expect(wrapper.state('displayMap')).toBe(false);
      wrapper.find(Button).simulate('click');
      expect(wrapper.state('displayMap')).toBe(true);
      wrapper.find(Button).simulate('click');
      expect(wrapper.state('displayMap')).toBe(false);
    });
    describe('parseTimestamp', () => {
      test('returns a formatted timestamp', () => {
        const bar = moment(defaultCommentData.created_at).format('DD.MM.YYYY hh:mm');
        const wrapper = getWrapper();
        expect(wrapper.instance().parseTimestamp(defaultCommentData.created_at)).toEqual(bar);
      });
    });
    describe('dateTooltip', () => {
      test('returns a Tooltip', () => {
        const wrapper = getWrapper();
        const tooltipElement = wrapper.instance().dateTooltip(defaultCommentData.created_at);
        const tooltipWrapper = shallow(<div>{tooltipElement}</div>);
        expect(tooltipWrapper.find(Tooltip)).toHaveLength(1);
        expect(tooltipWrapper.find(Tooltip).prop('id')).toBe('comment-date-tooltip');
      });
    });
  });
});
