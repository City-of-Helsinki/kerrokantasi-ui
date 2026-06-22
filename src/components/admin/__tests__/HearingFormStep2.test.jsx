import configureStore from 'redux-mock-store';
import { act, fireEvent, screen } from '@testing-library/react';

import { thunk, mockStore as mockData } from '../../../../test-utils';
import HearingFormStep2 from '../HearingFormStep2';
import renderWithProviders from '../../../utils/renderWithProviders';

vi.mock('hds-react', async () => {
  const actual = await vi.importActual('hds-react');

  return {
    ...actual,
    FileInput: vi.fn().mockImplementation(() => <div>FileInput</div>),
  };
});

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const storeInitialState = { language: 'fi' };

const renderComponent = (propOverrides, storeOverride) => {
  const { mockHearingWithSections } = mockData;

  const props = {
    hearing: mockHearingWithSections.data,
    hearingLanguages: ['fi', 'sv'],
    sectionMoveUp: vi.fn(),
    sectionMoveDown: vi.fn(),
    dispatch: vi.fn(),
    addOption: vi.fn(),
    deleteOption: vi.fn(),
    onQuestionChange: vi.fn(),
    onDeleteTemporaryQuestion: vi.fn(),
    clearQuestions: vi.fn(),
    initMultipleChoiceQuestion: vi.fn(),
    initSingleChoiceQuestion: vi.fn(),
    onSectionAttachment: vi.fn(),
    onSectionAttachmentDelete: vi.fn(),
    onSectionChange: vi.fn(),
    onSectionImageChange: vi.fn(),
    onDeleteExistingQuestion: vi.fn(),
    onContinue: vi.fn(),
    ...propOverrides,
  };

  const store = storeOverride || mockStore(storeInitialState);

  return renderWithProviders(<HearingFormStep2 {...props} />, { store });
};

describe('<HearingFormStep2 />', () => {
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

  it('should add a new section when add button is clicked', async () => {
    const store = mockStore(storeInitialState);

    renderComponent({}, store);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'addSection' }));
    });

    const actions = store.getActions();
    const expected = [
      { type: 'addSection', payload: { section: expect.anything() } },
    ];

    expect(actions).toEqual(expected);
  });

  it('should delete a section when delete button is clicked', async () => {
    const store = mockStore(storeInitialState);

    renderComponent({}, store);

    await act(async () => {
      fireEvent.click(screen.getAllByText('deleteSection')[0]);
    });

    const actions = store.getActions();
    const expected = [
      { type: 'removeSection', payload: { sectionID: undefined } },
    ];

    expect(actions).toEqual(expected);
  });

  it('should call onContinue when continue button is clicked', async () => {
    const onContinue = vi.fn();
    renderComponent({ onContinue });

    await act(async () => {
      fireEvent.click(screen.getByText('hearingFormNext'));
    });

    expect(onContinue).toHaveBeenCalled();
  });
});
