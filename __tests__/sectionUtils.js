import {
  initNewSection,
} from '../src/utils/section';


test('New section initializer accepts initial values', () => {
  const section = initNewSection({id: "test-id"});
  expect(section.id).toBe("test-id");
});
