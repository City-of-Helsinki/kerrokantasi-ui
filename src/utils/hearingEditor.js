// @flow
import {normalize} from 'normalizr';
import uuid from 'uuid/v1';
import {compose} from 'ramda';

import {hearingSchema} from '../types';

const ATTR_WITH_FRONT_ID = [
  'sections',
  'labels',
  'contact_persons',
];

export const fillFrontId = (
  obj: {frontId: ?string, id: ?string},
  idGenerator: () => string = uuid
) => (
  {
    ...obj,
    frontId: obj.frontId || obj.id || idGenerator(),
  }
);

export const fillFrontIds = (thingz: Array<Object>, idGenerator: () => string = uuid) =>
  thingz.map((thing) => fillFrontId(thing, idGenerator));

export const normalizeEntitiesByFrontId = (data: Object, entityKey: string, idGenerator: () => string = uuid) =>
  normalize({
    ...data,
    [entityKey]: fillFrontIds(data[entityKey], idGenerator),
  }, hearingSchema).entities[entityKey] || {};

export const normalizeHearing = (hearing: Object) =>
  normalize(hearing, hearingSchema);

export const fillFrontIdsForAttributes = (data: Object, attrKeys: Array<string> = ATTR_WITH_FRONT_ID) => ({
  ...data,
  ...attrKeys.reduce((filled, key) => ({
    ...filled,
    [key]: fillFrontIds(data[key]),
  }), {})
});

export const fillFrontIdsAndNormalizeHearing = compose(normalizeHearing, fillFrontIdsForAttributes);
