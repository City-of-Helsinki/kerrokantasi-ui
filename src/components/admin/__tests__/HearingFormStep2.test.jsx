import React from 'react';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import { fireEvent, screen } from '@testing-library/react';

import HearingFormStep2 from '../HearingFormStep2';
import renderWithProviders from '../../../utils/renderWithProviders';
import { mockStore as mockData } from '../../../../test-utils';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const storeInitialState = { language: 'fi' };

const renderComponent = (propOverrides, storeOverride) => {
  const { mockHearingWithSections } = mockData;

  const props = {
    hearing: mockHearingWithSections.data,
    hearingLanguages: ['fi', 'sv'],
    sectionMoveUp: jest.fn(),
    sectionMoveDown: jest.fn(),
    dispatch: jest.fn(),
    addOption: jest.fn(),
    deleteOption: jest.fn(),
    onQuestionChange: jest.fn(),
    onDeleteTemporaryQuestion: jest.fn(),
    clearQuestions: jest.fn(),
    initMultipleChoiceQuestion: jest.fn(),
    initSingleChoiceQuestion: jest.fn(),
    onEditSectionAttachmentOrder: jest.fn(),
    onSectionAttachment: jest.fn(),
    onSectionAttachmentDelete: jest.fn(),
    onSectionAttachmentEdit: jest.fn(),
    onSectionChange: jest.fn(),
    onSectionImageChange: jest.fn(),
    onDeleteExistingQuestion: jest.fn(),
    onContinue: jest.fn(),
    intl: { formatMessage: jest.fn(({ id }) => id) },
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
    window.IntersectionObserver = jest.fn().mockImplementation(intersectionObserverMock);
  });

  afterAll(() => {
    window.IntersectionObserver = originalInterSectionObserver;

    jest.clearAllMocks();
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
    const onContinue = jest.fn();
    renderComponent({ onContinue });

    fireEvent.click(screen.getByText('hearingFormNext'));

    expect(onContinue).toHaveBeenCalled();
  });
});
