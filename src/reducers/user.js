export default function user(state, action) {
  if (action.type === 'login') {
    return {
      id: 'cmljayBhc3RsZXk=',
      name: 'Mock von User'
    };
  }
  if (action.type === 'logout') {
    return null;
  }
  return null;
}
