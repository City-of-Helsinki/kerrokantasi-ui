import {PropTypes} from 'react';


export const geoJSONshape = PropTypes.shape({
  type: PropTypes.string,
  coordinates: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.arrayOf(
          PropTypes.number
        )
      ])
    )
  )
});


export const labelShape = PropTypes.shape({
  id: PropTypes.number,
  label: PropTypes.string,
});


export const contactShape = PropTypes.shape({
  email: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  ornaization: PropTypes.string,
  phone: PropTypes.string,
  title: PropTypes.string,
});


export const sectionImageShape = PropTypes.shape({
  id: PropTypes.number,
  title: PropTypes.string,
  url: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  caption: PropTypes.string,
});


export const sectionShape = PropTypes.shape({
  id: PropTypes.string,
  type: PropTypes.string,
  commenting: PropTypes.string,
  voting: PropTypes.string,
  published: PropTypes.bool,
  title: PropTypes.string,
  abstract: PropTypes.string,
  content: PropTypes.string,
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
  abstract: PropTypes.string,
  title: PropTypes.string,
  slug: PropTypes.string,
  id: PropTypes.string,
  borough: PropTypes.string,
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
  created_at: PropTypes.string,
  is_registered: PropTypes.bool,
  geojson: geoJSONshape,
  images: PropTypes.arrayOf(PropTypes.object),
  label: labelShape,
  plugin_data: PropTypes.string,  // Not sure about this
});
