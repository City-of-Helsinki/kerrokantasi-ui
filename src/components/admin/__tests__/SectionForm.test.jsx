/* eslint-disable react/prop-types */
import configureStore from 'redux-mock-store';
import { act, fireEvent, screen } from '@testing-library/react';

import {
  thunk,
  getIntlAsProp,
  mockStore as mockData,
} from '../../../../test-utils';
import SectionForm from '../SectionForm';
import renderWithProviders from '../../../utils/renderWithProviders';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

vi.mock('hds-react', async () => {
  const actual = await vi.importActual('hds-react');

  return {
    ...actual,
    FileInput: vi.fn().mockImplementation(() => <div>FileInput</div>),
    // Stub Select so tests can drive onChange via fireEvent.change on a native <select>.
    // The stub propagates the same { value } shape that SectionForm's onChange expects.
    Select: ({ id, onChange, options }) => (
      <select
        data-testid={`select-${id}`}
        onChange={(e) => onChange({ value: e.target.value })}
      >
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    ),
  };
});

const storeInitialState = { language: 'fi' };
const { mockHearingWithSections } = mockData;

const renderComponent = (propOverrides, storeOverride) => {
  const props = {
    section: {
      ...mockHearingWithSections.data.sections[0],
      frontId: mockHearingWithSections.data.sections[0].id,
    },
    sectionLanguages: ['fi'],
    onSectionChange: vi.fn(),
    intl: getIntlAsProp(),
    ...propOverrides,
  };

  const store = storeOverride || mockStore(storeInitialState);

  return renderWithProviders(<SectionForm {...props} />, { store });
};

describe('<SectionForm />', () => {
  const originalInterSectionObserver = window.IntersectionObserver;

  const intersectionObserverMock = function () {
    return {
      observe: () => null,
      disconnect: () => null,
    };
  };

  beforeAll(() => {
    window.IntersectionObserver = vi
      .fn()
      .mockImplementation(intersectionObserverMock);
  });

  afterAll(() => {
    window.IntersectionObserver = originalInterSectionObserver;

    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    renderComponent();
  });

  it('should call onSectionChange when title is changed', async () => {
    const onSectionChange = vi.fn();

    renderComponent({
      onSectionChange,
      section: {
        ...mockHearingWithSections.data.sections[1],
        frontId: mockHearingWithSections.data.sections[1].id,
      },
    });

    const titleInput = screen.getAllByLabelText('inLanguage-fi')[0];

    await act(async () => {
      fireEvent.blur(titleInput, { target: { value: 'New Title' } });
    });

    expect(onSectionChange).toHaveBeenCalledWith(expect.anything(), 'title', {
      fi: 'New Title',
    });
  });

  it('should toggle commenting map tools', async () => {
    const onSectionChange = vi.fn();

    renderComponent({ onSectionChange });

    const checkbox = screen.getByRole('checkbox');

    await act(async () => {
      fireEvent.click(checkbox);
    });

    expect(onSectionChange).toHaveBeenCalledWith(
      expect.anything(),
      'commenting_map_tools',
      'none'
    );
  });

  it('should call sectionMoveUp when move up button is clicked', async () => {
    const sectionMoveUp = vi.fn();

    renderComponent({
      sectionMoveUp,
      isFirstSubsection: false,
      section: {
        ...mockHearingWithSections.data.sections[1],
        frontId: mockHearingWithSections.data.sections[1].id,
      },
    });

    const button = screen.getByText('moveUp', { exact: false });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(sectionMoveUp).toHaveBeenCalled();
  });

  it('should call sectionMoveDown when move down button is clicked', async () => {
    const sectionMoveDown = vi.fn();

    renderComponent({
      sectionMoveDown,
      isLastSubsection: false,
      section: {
        ...mockHearingWithSections.data.sections[1],
        frontId: mockHearingWithSections.data.sections[1].id,
      },
    });

    const button = screen.getByText('moveDown', { exact: false });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(sectionMoveDown).toHaveBeenCalled();
  });

  it('should call initSingleChoiceQuestion when new single choice question button is clicked', async () => {
    const initSingleChoiceQuestion = vi.fn();

    renderComponent({ initSingleChoiceQuestion });

    const button = screen.getByText('newSingleChoiceQuestion');

    await act(async () => {
      fireEvent.click(button);
    });

    expect(initSingleChoiceQuestion).toHaveBeenCalled();
  });

  it('should call initMultipleChoiceQuestion when new multiple choice question button is clicked', async () => {
    const initMultipleChoiceQuestion = vi.fn();

    renderComponent({ initMultipleChoiceQuestion });

    const button = screen.getByText('newMultipleChoiceQuestion');

    await act(async () => {
      fireEvent.click(button);
    });

    expect(initMultipleChoiceQuestion).toHaveBeenCalled();
  });

  it('abstract field blur calls onSectionChange with abstract field and value', async () => {
    const onSectionChange = vi.fn();
    // sections[0] is type 'main' (special) — title field hidden.
    // MultiLanguageTextField label order: [0] imageCaption, [1] abstract, [2] content RichTextEditor
    renderComponent({ onSectionChange });

    const abstractInput = screen.getAllByLabelText('inLanguage-fi')[1];
    await act(async () => {
      fireEvent.blur(abstractInput, { target: { value: 'Abstract text' } });
    });

    expect(onSectionChange).toHaveBeenCalledWith(
      expect.anything(),
      'abstract',
      { fi: 'Abstract text' }
    );
  });

  it('image caption field blur calls onSectionImageCaptionChange', async () => {
    const onSectionImageCaptionChange = vi.fn();
    renderComponent({ onSectionImageCaptionChange });

    const captionInput = screen.getAllByLabelText('inLanguage-fi')[0];
    await act(async () => {
      fireEvent.blur(captionInput, { target: { value: 'Caption text' } });
    });

    expect(onSectionImageCaptionChange).toHaveBeenCalledWith(
      expect.anything(),
      { fi: 'Caption text' }
    );
  });

  it('commenting Select change calls onSectionChange with commenting field', async () => {
    const onSectionChange = vi.fn();
    renderComponent({ onSectionChange });

    await act(async () => {
      fireEvent.change(screen.getByTestId('select-commenting'), {
        target: { value: 'registered' },
      });
    });

    expect(onSectionChange).toHaveBeenCalledWith(
      expect.anything(),
      'commenting',
      'registered'
    );
  });

  it('voting Select change calls onSectionChange with voting field', async () => {
    const onSectionChange = vi.fn();
    renderComponent({ onSectionChange });

    await act(async () => {
      fireEvent.change(screen.getByTestId('select-voting'), {
        target: { value: 'open' },
      });
    });

    expect(onSectionChange).toHaveBeenCalledWith(
      expect.anything(),
      'voting',
      'open'
    );
  });

  it('commenting_map_tools Select change calls onSectionChange when map tools are enabled', async () => {
    const onSectionChange = vi.fn();
    // sections[0] has commenting_map_tools=undefined → enabledCommentMap=true → Select visible
    renderComponent({ onSectionChange });

    await act(async () => {
      fireEvent.change(screen.getByTestId('select-commenting_map_tools'), {
        target: { value: 'marker' },
      });
    });

    expect(onSectionChange).toHaveBeenCalledWith(
      expect.anything(),
      'commenting_map_tools',
      'marker'
    );
  });

  it('question with frontId renders delete button that fires onDeleteTemporaryQuestion', async () => {
    const onDeleteTemporaryQuestion = vi.fn();
    const section = {
      ...mockHearingWithSections.data.sections[0],
      frontId: mockHearingWithSections.data.sections[0].id,
      questions: [
        {
          frontId: 'qf-1',
          id: undefined,
          type: 'single-choice',
          text: { fi: '' },
          options: [],
          n_answers: 0,
        },
      ],
    };

    renderComponent({ section, onDeleteTemporaryQuestion });

    await act(async () => {
      fireEvent.click(screen.getByText('deleteQuestion'));
    });
    expect(onDeleteTemporaryQuestion).toHaveBeenCalledWith(
      section.frontId,
      'qf-1'
    );
  });

  it('question with id and !isPublic renders delete button that fires onDeleteExistingQuestion', async () => {
    const onDeleteExistingQuestion = vi.fn();
    const section = {
      ...mockHearingWithSections.data.sections[0],
      frontId: mockHearingWithSections.data.sections[0].id,
      questions: [
        {
          id: 'q-server-1',
          frontId: undefined,
          type: 'multiple-choice',
          text: { fi: '' },
          options: [],
          n_answers: 0,
        },
      ],
    };

    renderComponent({ section, onDeleteExistingQuestion, isPublic: false });

    await act(async () => {
      fireEvent.click(screen.getByText('deleteQuestion'));
    });
    expect(onDeleteExistingQuestion).toHaveBeenCalledWith(
      section.frontId,
      'q-server-1'
    );
  });
});
