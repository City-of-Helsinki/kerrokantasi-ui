import { describe } from 'node:test';

import { prepareSection, validateHearing } from '../hearingEditor';
import { initNewHearing } from '../hearing';

describe('prepareSection', () => {
  it('should set the id property to empty in questions, options, images, and files', () => {
    const section = {
      id: 'sectionId',
      questions: [
        {
          id: 'questionId',
          options: [
            { id: 'optionId1', value: 'Option 1' },
            { id: 'optionId2', value: 'Option 2' },
          ],
        },
      ],
      images: [
        { id: 'imageId1', url: 'image1.jpg' },
        { id: 'imageId2', url: 'image2.jpg' },
      ],
      files: [
        { id: 'fileId1', name: 'file1.pdf' },
      ],
    };

    const preparedSection = prepareSection(section);

    expect(preparedSection.id).toBe('');

    preparedSection.questions.forEach((question) => {
      expect(question.id).toBe('');

      question.options.forEach((option) => {
        expect(option.id).toBe('');
      });
    });

    preparedSection.images.forEach((image) => {
      expect(image.id).toBe('');
    });

    expect(preparedSection.files[0].id).toBe('');
    expect(preparedSection.files[0].reference_id).toBe('fileId1');
  });
});

describe('validateHearing', () => {
  it('should return an empty array if all required fields are present', () => {
    const hearing = initNewHearing();
    hearing.slug = 'slug';
    hearing.contact_persons = [{ id: '1' }];
    hearing.labels = [{ id: '1' }];
    hearing.title = {fi: 'title'};
    hearing.close_at = '2021-01-01T00:00:00Z';
    hearing.open_at = '2021-01-01T00:00:00Z';

    const errors = validateHearing(hearing, ['fi']);

    expect(errors).toEqual({
      "1": {},
      "4": {},
      "5": {},
    });
  });

  it('should return an array of errors if required fields are missing', () => {
    const hearing = initNewHearing();

    const errors = validateHearing(hearing, ['fi']);

    expect(errors).toEqual(
      {
        "1": {
          "contact_persons": "Aseta ainakin yksi yhteyshenkilö.",
          "labels": "Aseta ainakin yksi asiasana.",
          "slug": "Aseta osoite ennen tallentamista.",
          "title": "Aseta otsikko ennen tallentamista."
        },
        "4": {
          "close_at": "Aseta sulkeutumisaika ennen tallentamista.", 
          "open_at": "Aseta avautumisaika ennen tallentamista."
        },
        "5": {
        }});
  });
});
