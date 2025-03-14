import React from 'react';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import HearingForm from '../HearingForm';
import renderWithProviders from '../../../utils/renderWithProviders';
import { mockStore as mockData } from '../../../../test-utils';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

vi.mock('hds-react', async () => {
  const actual = await vi.importActual('hds-react');

  return {
    ...actual,
    FileInput: vi.fn().mockImplementation(() => <div>FileInput</div>),
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
    intl: { formatMessage: vi.fn((msg) => msg.id) },
    editorMetaData: {},
    hearing: { ...mockHearingWithSections.data, published: false },
    isSaving: false,
    labels: [],
    language: 'en',
    hearingLanguages: [],
    dispatch: vi.fn(),
    show: true,
    sectionMoveUp: vi.fn(),
    sectionMoveDown: vi.fn(),
    addOption: vi.fn(),
    deleteOption: vi.fn(),
    onQuestionChange: vi.fn(),
    onDeleteTemporaryQuestion: vi.fn(),
    clearQuestions: vi.fn(),
    initMultipleChoiceQuestion: vi.fn(),
    initSingleChoiceQuestion: vi.fn(),
    onAddMapMarker: vi.fn(),
    onAddMapMarkersToCollection: vi.fn(),
    onCreateMapMarker: vi.fn(),
    onDeleteExistingQuestion: vi.fn(),
    onHearingChange: vi.fn(),
    onLanguagesChange: vi.fn(),
    onSectionAttachment: vi.fn(),
    onSectionAttachmentDelete: vi.fn(),
    onSectionChange: vi.fn(),
    onSectionImageChange: vi.fn(),
    onSaveChanges: vi.fn(),
    onSaveAsCopy: vi.fn(),
    onSaveAndPreview: vi.fn(),
    onLeaveForm: vi.fn(),
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
    window.IntersectionObserver = vi.fn().mockImplementation(intersectionObserverMock);
  });

  afterAll(() => {
    window.IntersectionObserver = originalInterSectionObserver;

    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    renderComponent();
  });

  it('should call onLeaveForm when cancel button is clicked', () => {
    const onLeaveForm = vi.fn();

    renderComponent({ onLeaveForm });

    fireEvent.click(screen.getByText('cancel'));

    expect(onLeaveForm).toHaveBeenCalled();
  });

  it('should call onSaveAndPreview when save and preview button is clicked', () => {
    const onSaveAndPreview = vi.fn();

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
