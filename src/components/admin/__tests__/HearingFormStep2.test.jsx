import React from 'react';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import { fireEvent, screen } from '@testing-library/react';

import HearingFormStep2 from '../HearingFormStep2';
import renderWithProviders from '../../../utils/renderWithProviders';
import { getIntlAsProp, mockStore as mockData } from '../../../../test-utils';

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
    intl: getIntlAsProp(),
    ...propOverrides,
  };

  const store = storeOverride || mockStore(storeInitialState);

  return renderWithProviders(<HearingFormStep2 {...props} />, { store });
};

describe('<HearingFormStep2 />', () => {
  const originalInterSectionObserver = window.IntersectionObserver;

  const intersectionObserverMock = () => ({
    observe: () => null,
    disconnect: () => null,
  });

  beforeAll(() => {
    window.IntersectionObserver = vi.fn().mockImplementation(intersectionObserverMock);
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

    fireEvent.click(screen.getByRole('button', { name: 'addSection' }));

    const actions = store.getActions();
    const expected = [{ type: 'addSection', payload: { section: expect.anything() } }];

    expect(actions).toEqual(expected);
  });

  it('should delete a section when delete button is clicked', async () => {
    const store = mockStore(storeInitialState);

    renderComponent({}, store);

    fireEvent.click(screen.getAllByText('deleteSection')[0]);

    const actions = store.getActions();
    const expected = [{ type: 'removeSection', payload: { sectionID: undefined } }];

    expect(actions).toEqual(expected);
  });

  it('should call onContinue when continue button is clicked', () => {
    const onContinue = vi.fn();
    renderComponent({ onContinue });

    fireEvent.click(screen.getByText('hearingFormNext'));

    expect(onContinue).toHaveBeenCalled();
  });
});
