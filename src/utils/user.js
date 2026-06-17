import { get } from 'lodash';
/**
 *
 * @param  {Object} user [description]
 * @return {String}      [description]
 */
export const getNickname = (user) =>
  user && user.nickname ? user.nickname : '';

export const getAuthorDisplayName = (user) => get(user, 'displayName');

export function isAdmin(user) {
  return (
    !!user && !!user.adminOrganizations && user.adminOrganizations.length > 0
  );
}

export default null;
