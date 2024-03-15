import { prepareSection } from '../hearingEditor';

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
