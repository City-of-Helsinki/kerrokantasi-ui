import {
  beforeSend,
  beforeSendTransaction,
  cleanSensitiveData,
} from '../index';

const sensitive = 'sensitive';
const safe = 'safe';

const originalData = {
  a: safe,
  additional_info: sensitive,
  admin_organizations: sensitive,
  adminOrganizations: sensitive,
  answered_questions: sensitive,
  author_name: sensitive,
  contact_persons: sensitive,
  contactPersons: sensitive,
  contacts: sensitive,
  displayName: sensitive,
  email: sensitive,
  external_organization: sensitive,
  favorite_hearings: sensitive,
  first_name: sensitive,
  firstname: sensitive,
  followed_hearings: sensitive,
  has_strong_auth: sensitive,
  hasStrongAuth: sensitive,
  last_name: sensitive,
  lastname: sensitive,
  name: sensitive,
  nickname: sensitive,
  oidc: sensitive,
  oidcUser: sensitive,
  organization: sensitive,
  organizations: sensitive,
  phone: sensitive,
  profile: sensitive,
  provider: sensitive,
  title: sensitive,
  user: sensitive,
  username: sensitive,
  arrayOfObjects: [
    { a: safe, oidcUser: sensitive },
    { b: safe, oidcUser: sensitive },
  ],
  arrayOfStrings: [safe],
  object: { c: safe, first_name: sensitive, last_name: sensitive },
};

const cleanedData = {
  a: safe,
  arrayOfObjects: [{ a: safe }, { b: safe }],
  arrayOfStrings: [safe],
  object: { c: safe },
};

describe('beforeSend', () => {
  it('should clear sensitive data', () => {
    expect(
      beforeSend({ extra: { data: originalData }, type: undefined })
    ).toEqual({ extra: { data: cleanedData } });
  });
});

describe('beforeSendTransaction', () => {
  it('should clear sensitive data', () => {
    expect(
      beforeSendTransaction({
        extra: { data: originalData },
        type: 'transaction',
      })
    ).toEqual({ extra: { data: cleanedData }, type: 'transaction' });
  });
});

describe('cleanSensitiveData', () => {
  it('should clear sensitive data', () => {
    expect(cleanSensitiveData(originalData)).toEqual(cleanedData);
  });
});
