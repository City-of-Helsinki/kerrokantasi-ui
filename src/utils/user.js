
export function isAdmin(user) {
  return !!user && !!user.adminOrganizations && user.adminOrganizations.length > 0;
}

export default null;
