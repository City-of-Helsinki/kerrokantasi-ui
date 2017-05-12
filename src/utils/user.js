import {get} from 'lodash';
/**
 *
 * @param  {Object} user [description]
 * @return {String}      [description]
 */
export const getNickname = (user) => {
  return user && user.nickname ? user.nickname : '';
};

/**
 * [getAuthorName description]
 * @param  {Object} user [description]
 * @return {String}      [description]
 */
export const getAuthorName = (user) => {
  return get(user, 'nickname') || get(user, 'displayName');
};

export default null;
