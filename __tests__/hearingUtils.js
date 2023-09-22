import {
  acceptsComments,
  canEdit,
  getMainSection,
  getOrCreateSectionByID,
  getSectionByID,
  initNewHearing,
} from '../src/utils/hearing';


test('New hearing initializer accepts initial values', () => {
  const hearing = initNewHearing({ slug: "test-slug" });
  const mainSection = getMainSection(hearing);
  expect(hearing.slug).toBe("test-slug");
  expect(mainSection.id).toBeDefined();
});


test('Open hearing accepts comments', () => {
  const now = new Date();
  const tomorrow = now.setDate(now.getDate() + 1);
  const hearing = initNewHearing({
    close_at: tomorrow,
  });
  expect(acceptsComments(hearing)).toBe(true);
});


test('Closed hearing does not accept comments', () => {
  const now = new Date();
  const yesterday = now.setDate(now.getDate() - 1);
  const hearing = initNewHearing({
    close_at: yesterday,
  });
  expect(acceptsComments(hearing)).toBe(false);
});


test('Hearing utils getOrCreateSectionByID', () => {
  const hearing = initNewHearing();
  let section = getSectionByID(hearing, "some-id");
  expect(section).not.toBeDefined();

  section = getOrCreateSectionByID(hearing, "some-id");
  expect(section.id).toBe("some-id");
});


test('Organization admin is allowed to edit hearing', () => {
  const hearing = initNewHearing({ organization: "test-org" });
  const user = { adminOrganizations: ["test-org"] };
  expect(canEdit(user, hearing)).toBe(true);
});


test('Anonymous user is not allowed to edit hearing', () => {
  const hearing = initNewHearing({ organization: "test-org" });
  const user = null;
  expect(canEdit(user, hearing)).toBe(false);
});
