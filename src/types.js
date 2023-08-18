// @flow
import PropTypes from 'prop-types';
import {schema} from 'normalizr';

import config from './config';

const {languages} = config;

export const geoJSONshape = PropTypes.shape({
  type: PropTypes.string,
  coordinates: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.arrayOf(
            PropTypes.oneOfType([
              PropTypes.number,
              PropTypes.arrayOf(PropTypes.number)
            ])
          )
        ])
      )
    ])
  )
});

export const translatedShape = PropTypes.oneOfType([
  PropTypes.shape(
    languages.reduce((shape, lang) =>
      ({ ...shape, [lang]: PropTypes.string}), {})
  ),
  PropTypes.string
]);

export const labelShape = PropTypes.shape({
  id: PropTypes.number,
  label: translatedShape,
});

export const commentHearingDataShape = PropTypes.shape({
  slug: PropTypes.string,
  title: PropTypes.object
});


export const contactShape = PropTypes.shape({
  email: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  organization: PropTypes.string,
  external_organization: PropTypes.bool,
  additional_info: PropTypes.string,
  phone: PropTypes.string,
  title: translatedShape,
});

export const organizationShape = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  external_organization: PropTypes.bool,
});

export const textEditorHideControlsShape = PropTypes.shape({
  hideBlockStyleControls: PropTypes.bool,
  hideInlineStyleControls: PropTypes.bool,
  hideIframeControls: PropTypes.bool,
  hideImageControls: PropTypes.bool,
  hideSkipLinkControls: PropTypes.bool,
  hideLinkControls: PropTypes.bool,
});

export const sectionImageShape = PropTypes.shape({
  id: PropTypes.number,
  title: translatedShape,
  url: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  caption: translatedShape,
});


export const sectionShape = PropTypes.shape({
  id: PropTypes.string,
  type: PropTypes.string,
  commenting: PropTypes.string,
  voting: PropTypes.string,
  title: translatedShape,
  abstract: translatedShape,
  content: translatedShape,
  created_at: PropTypes.string,
  created_by: PropTypes.string,
  images: PropTypes.arrayOf(sectionImageShape),
  n_comments: PropTypes.number,
  type_name_singular: PropTypes.string,
  type_name_plural: PropTypes.string,
  plugin_identifier: PropTypes.string,
  plugin_data: PropTypes.string,
  plugin_iframe_url: PropTypes.string,
  plugin_fullscreen: PropTypes.bool,
});


export const hearingEditorMetaDataShape = PropTypes.shape({
  labels: PropTypes.arrayOf(labelShape),
  contacts: PropTypes.arrayOf(contactShape)
});


export const hearingShape = PropTypes.shape({
  abstract: translatedShape,
  title: translatedShape,
  slug: PropTypes.string,
  id: PropTypes.string,
  borough: translatedShape,
  n_comments: PropTypes.number,
  published: PropTypes.bool,
  labels: PropTypes.arrayOf(labelShape),
  open_at: PropTypes.string,
  close_at: PropTypes.string,
  created_at: PropTypes.string,
  servicemap_url: PropTypes.string,
  sections: PropTypes.arrayOf(sectionShape),
  closed: PropTypes.bool,
  geojson: geoJSONshape,
  organization: PropTypes.string,
  main_image: sectionImageShape,
  contact_persons: PropTypes.arrayOf(contactShape),
  default_to_fullscreen: PropTypes.bool,
});


export const userShape = PropTypes.shape({
  id: PropTypes.string,
  displayName: PropTypes.string,
  firstname: PropTypes.string,
  lastname: PropTypes.string,
  username: PropTypes.string,
  provider: PropTypes.string,
  token: PropTypes.string,
  adminOrganizations: PropTypes.arrayOf(PropTypes.string),
});


// TODO: Make sure this is correct and start using it.
export const commentShape = PropTypes.shape({
  section: PropTypes.string,
  id: PropTypes.number,
  content: PropTypes.string,
  author_name: PropTypes.string,
  n_votes: PropTypes.number,
  hearing_data: PropTypes.oneOf([commentHearingDataShape, PropTypes.bool]),
  created_at: PropTypes.string,
  is_registered: PropTypes.bool,
  geojson: geoJSONshape,
  images: PropTypes.arrayOf(PropTypes.object),
  label: labelShape,
  plugin_data: PropTypes.string,  // Not sure about this
});

export const labelSchema = new schema.Entity('labels', {}, {idAttribute: 'frontId'});
export const labelResultsSchema = new schema.Array(labelSchema);
export const sectionSchema = new schema.Entity('sections', {}, {idAttribute: 'frontId'});
export const contactPersonSchema = new schema.Entity('contactPersons', {}, {idAttribute: 'frontId'});
export const contactPersonResultsSchema = new schema.Array(contactPersonSchema);
export const organizationSchema = new schema.Entity('organizations', {}, {idAttribute: 'frontId'});
export const OrganizationResultsSchema = new schema.Array(organizationSchema);
export const hearingSchema = new schema.Entity('hearing', {
  labels: labelResultsSchema,
  sections: new schema.Array(sectionSchema),
  contact_persons: contactPersonResultsSchema,
});