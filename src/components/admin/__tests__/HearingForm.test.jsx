import React from 'react';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import HearingForm from '../HearingForm';
import renderWithProviders from '../../../utils/renderWithProviders';
import { mockStore as mockData } from '../../../../test-utils';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

jest.mock('hds-react', () => {
  const actual = jest.requireActual('hds-react');

  return {
    ...actual,
    FileInput: jest.fn().mockImplementation(() => <div>FileInput</div>),
  };
});

const storeInitialState = {
  projectLists: {
    isFetching: false,
    data: [
      {
        id: '123',
        title: {
          en: 'en',
          fi: 'fi',
          sv: 'sv',
        },
        phases: [
          {
            id: '3456',
            has_hearings: true,
            hearings: ['test'],
            title: {
              en: 'en',
              fi: 'fi',
              sv: 'sv',
            },
            description: {
              en: 'test',
              fi: 'test',
              sv: 'test',
            },
            schedule: {
              en: '2024',
              fi: '2024',
              sv: '2024',
            },
          },
        ],
      },
    ],
  },
  accessibility: { isHighContrast: false },
};

const renderComponent = (propOverrides, storeOverride) => {
  const { mockHearingWithSections } = mockData;

  const props = {
    contactPersons: mockHearingWithSections.data.contact_persons,
    currentStep: 1,
    organizations: [],
    intl: { formatMessage: jest.fn((msg) => msg.id) },
    editorMetaData: {},
    hearing: { ...mockHearingWithSections.data, published: false },
    isSaving: false,
    labels: [],
    language: 'en',
    hearingLanguages: [],
    dispatch: jest.fn(),
    show: true,
    sectionMoveUp: jest.fn(),
    sectionMoveDown: jest.fn(),
    addOption: jest.fn(),
    deleteOption: jest.fn(),
    onQuestionChange: jest.fn(),
    onDeleteTemporaryQuestion: jest.fn(),
    clearQuestions: jest.fn(),
    initMultipleChoiceQuestion: jest.fn(),
    initSingleChoiceQuestion: jest.fn(),
    onAddMapMarker: jest.fn(),
    onAddMapMarkersToCollection: jest.fn(),
    onCreateMapMarker: jest.fn(),
    onDeleteExistingQuestion: jest.fn(),
    onHearingChange: jest.fn(),
    onLanguagesChange: jest.fn(),
    onSectionAttachment: jest.fn(),
    onSectionAttachmentDelete: jest.fn(),
    onSectionChange: jest.fn(),
    onSectionImageChange: jest.fn(),
    onSaveChanges: jest.fn(),
    onSaveAsCopy: jest.fn(),
    onSaveAndPreview: jest.fn(),
    onLeaveForm: jest.fn(),
    errors: {},
    ...propOverrides,
  };

  const store = storeOverride || mockStore(storeInitialState);

  return renderWithProviders(<HearingForm {...props} />, { store });
};

describe('<HearingForm />', () => {
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

  it('should call onLeaveForm when cancel button is clicked', () => {
    const onLeaveForm = jest.fn();

    renderComponent({ onLeaveForm });

    fireEvent.click(screen.getByText('cancel'));

    expect(onLeaveForm).toHaveBeenCalled();
  });

  it('should call onSaveAndPreview when save and preview button is clicked', () => {
    const onSaveAndPreview = jest.fn();

    renderComponent({ onSaveAndPreview });

    fireEvent.click(screen.getByText('saveAndPreviewHearing'));

    expect(onSaveAndPreview).toHaveBeenCalled();
  });

  it('should display errors if present', () => {
    const errors = {
      1: { title: 'Fill in title', slug: 'Fill in address' },
      5: { project_title: 'Fill in project title' },
    };

    renderComponent({ errors });

    expect(screen.getByText('saveFailed')).toBeInTheDocument();
  });

  it('should call onToggleClick when accordion is clicked', async () => {
    renderComponent();

    const accordion = screen.getAllByText(/partSection/i)[0];

    fireEvent.click(accordion);

    await waitFor(() => {
      expect(screen.getByText('hearingFormHeaderStep2')).toBeInTheDocument();
    });
  });

  it('should navigate to next step when onContinue is called', async () => {
    renderComponent();

    fireEvent.click(screen.getAllByText('hearingFormNext')[0]);

    await waitFor(() => {
      expect(screen.getByText('hearingFormHeaderStep2')).toBeInTheDocument();
    });
  });
});
