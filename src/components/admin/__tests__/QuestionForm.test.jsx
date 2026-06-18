import { fireEvent, screen } from '@testing-library/react';

import QuestionForm from '../QuestionForm';
import renderWithProviders from '../../../utils/renderWithProviders';

// Stub MultiLanguageTextField so tests don't need to boot HDS TextArea/TextInput internals.
// Renders a button whose text is "blur-{name}" and calls onBlur({fi: "value-{name}"}) on click.
vi.mock('../../forms/MultiLanguageTextField', () => ({
  default: ({ name, onBlur }) => (
    <button onClick={() => onBlur({ fi: `value-${name}` })}>blur-{name}</button>
  ),
  TextFieldTypes: { TEXTAREA: 'TEXTAREA' },
}));

const questionFactory = (overrides = {}) => ({
  id: 'q1',
  frontId: undefined,
  text: { fi: 'Kysymys' },
  options: [
    { id: 'opt1', text: { fi: 'Vaihtoehto A' }, n_answers: 1 },
    { id: 'opt2', text: { fi: 'Vaihtoehto B' }, n_answers: 0 },
  ],
  n_answers: 1,
  ...overrides,
});

const renderComponent = (props = {}) => {
  const defaultProps = {
    question: questionFactory(),
    sectionId: 'section-1',
    addOption: vi.fn(),
    deleteOption: vi.fn(),
    sectionLanguages: ['fi'],
    onQuestionChange: vi.fn(),
    onDeleteExistingQuestion: vi.fn(),
    lang: 'fi',
    isPublic: false,
  };
  return renderWithProviders(<QuestionForm {...defaultProps} {...props} />);
};

describe('<QuestionForm />', () => {
  it('renders editable form when question.frontId is set', () => {
    renderComponent({
      question: questionFactory({ frontId: 'front-1', id: undefined }),
    });

    expect(screen.getByText('blur-abstract')).toBeInTheDocument();
    expect(screen.getByText('blur-content-0')).toBeInTheDocument();
    expect(screen.getByText('addOption')).toBeInTheDocument();
    expect(screen.queryByText('deleteQuestion')).not.toBeInTheDocument();
  });

  it('renders editable form when id is set, isPublic is false, and n_answers is 0', () => {
    renderComponent({
      question: questionFactory({ id: 'q1', frontId: undefined, n_answers: 0 }),
      isPublic: false,
    });

    expect(screen.getByText('blur-abstract')).toBeInTheDocument();
    expect(screen.getByText('addOption')).toBeInTheDocument();
    expect(screen.queryByText('deleteQuestion')).not.toBeInTheDocument();
  });

  it('renders details form (public preview) when isPublic is true', () => {
    const { container } = renderComponent({
      question: questionFactory({ id: 'q1', frontId: undefined }),
      isPublic: true,
    });

    expect(screen.getByRole('heading', { level: 6 })).toHaveTextContent(
      'Kysymys'
    );
    // one ProgressBar wrapper per option
    expect(container.querySelectorAll('.progressBar-wrapper')).toHaveLength(2);
    expect(screen.getByText('deleteQuestion')).toBeInTheDocument();
    expect(screen.queryByText('addOption')).not.toBeInTheDocument();
    expect(screen.queryByText('blur-abstract')).not.toBeInTheDocument();
  });

  it('addOption button calls addOption(sectionId, frontId)', () => {
    const addOption = vi.fn();
    renderComponent({
      question: questionFactory({ frontId: 'front-1', id: undefined }),
      sectionId: 'section-1',
      addOption,
    });

    fireEvent.click(screen.getByText('addOption'));
    expect(addOption).toHaveBeenCalledTimes(1);
    expect(addOption).toHaveBeenCalledWith('section-1', 'front-1');
  });

  it('delete-option button only appears on the last option when options.length > 2', () => {
    const deleteOption = vi.fn();
    const threeOptions = [
      { id: 'opt1', text: { fi: 'A' }, n_answers: 0 },
      { id: 'opt2', text: { fi: 'B' }, n_answers: 0 },
      { id: 'opt3', text: { fi: 'C' }, n_answers: 0 },
    ];

    const { container, rerender } = renderComponent({
      question: questionFactory({
        frontId: 'front-1',
        id: undefined,
        options: threeOptions,
      }),
      sectionId: 'section-1',
      deleteOption,
    });

    // Icon renders a plain span with no text — query by the "danger" class on the Button.
    // The only danger-class button in the editable form is the trash icon.
    const trashButtons = container.querySelectorAll('button.danger');
    expect(trashButtons).toHaveLength(1);
    fireEvent.click(trashButtons[0]);
    expect(deleteOption).toHaveBeenCalledWith('section-1', 'front-1', 2);

    // with only 2 options, no trash button
    const twoOptions = threeOptions.slice(0, 2);
    rerender(
      <QuestionForm
        question={questionFactory({
          frontId: 'front-1',
          id: undefined,
          options: twoOptions,
        })}
        sectionId='section-1'
        addOption={vi.fn()}
        deleteOption={deleteOption}
        sectionLanguages={['fi']}
        onQuestionChange={vi.fn()}
        onDeleteExistingQuestion={vi.fn()}
        lang='fi'
        isPublic={false}
      />
    );
    expect(container.querySelectorAll('button.danger')).toHaveLength(0);
  });

  it('MultiLanguageTextField onBlur callbacks fire onQuestionChange with correct args', () => {
    const onQuestionChange = vi.fn();
    renderComponent({
      question: questionFactory({ frontId: 'front-1', id: undefined }),
      sectionId: 'section-1',
      onQuestionChange,
    });

    // abstract field → ('text', sectionId, frontId, '', value)
    fireEvent.click(screen.getByText('blur-abstract'));
    expect(onQuestionChange).toHaveBeenCalledWith(
      'text',
      'section-1',
      'front-1',
      '',
      { fi: 'value-abstract' }
    );

    // first option field → ('option', sectionId, frontId, 0, value)
    fireEvent.click(screen.getByText('blur-content-0'));
    expect(onQuestionChange).toHaveBeenCalledWith(
      'option',
      'section-1',
      'front-1',
      0,
      { fi: 'value-content-0' }
    );
  });

  it('deleteQuestion calls onDeleteExistingQuestion(sectionId, id) when both are set', () => {
    const onDeleteExistingQuestion = vi.fn();
    renderComponent({
      question: questionFactory({ id: 'q1', frontId: undefined }),
      sectionId: 'section-1',
      isPublic: true,
      onDeleteExistingQuestion,
    });

    fireEvent.click(screen.getByText('deleteQuestion'));
    expect(onDeleteExistingQuestion).toHaveBeenCalledTimes(1);
    expect(onDeleteExistingQuestion).toHaveBeenCalledWith('section-1', 'q1');
  });

  it('deleteQuestion does not call handler when sectionId is absent', () => {
    const onDeleteExistingQuestion = vi.fn();
    renderComponent({
      question: questionFactory({ id: 'q1', frontId: undefined }),
      sectionId: undefined,
      isPublic: true,
      onDeleteExistingQuestion,
    });

    fireEvent.click(screen.getByText('deleteQuestion'));
    expect(onDeleteExistingQuestion).not.toHaveBeenCalled();
  });
});
