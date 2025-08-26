import React from 'react';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { uniqueId } from 'lodash';
import { createMemoryHistory } from 'history';

import SectionContainerComponent from '../SectionContainer';
import { mockStore as mockData, mockUser } from '../../../../../test-utils';
import renderWithProviders from '../../../../utils/renderWithProviders';
import * as mockApi from '../../../../api';

const mockedData = {
  results: [],
};

vi.spyOn(mockApi, 'get').mockImplementation(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockedData),
    blob: () => Promise.resolve({}),
  }),
);

vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom');

  return {
    ...mod,
    useLocation: () => ({
      pathname: `/${mockData.mockHearingWithSections.data.id}`,
      search: '',
    }),
    useParams: () => ({
      hearingSlug: mockData.mockHearingWithSections.data.id,
    }),
  };
});

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

vi.mock('../../../../api', async () => {
  const mod = await vi.importActual('../../../../api');

  return {
    getApiURL: mod.getApiURL,
    getApiTokenFromStorage: vi.fn().mockReturnValue('dummyToken'),
    get: vi
      .fn()
      .mockResolvedValue({ ok: true, json: () => Promise.resolve(mockedData), blob: () => Promise.resolve() }),
  };
});

const renderComponent = (storeOverrides) => {
  const { mockHearingWithSections, sectionComments } = mockData;

  const store = mockStore({
    hearing: {
      [mockHearingWithSections.data.id]: {
        ...mockHearingWithSections,
      },
    },
    accessibility: {
      isHighContrast: false,
    },
    sectionComments,
    user: {
      data: mockUser,
    },
    ...storeOverrides,
  });

  const props = {
    hearing: {
      [mockHearingWithSections.data.id]: {
        data: mockHearingWithSections.data,
      },
    },
    fetchCommentsForSortableList: vi.fn(),
  };

  const history = createMemoryHistory();

  return renderWithProviders(
    <MemoryRouter>
      <SectionContainerComponent {...props} />
    </MemoryRouter>,
    { store, history },
  );
};

describe('<SectionContainer />', () => {
  const { mockHearingWithSections } = mockData;
  it('should render correctly', () => {
    renderComponent();
    expect(screen.getByTestId('hearing-content-section')).toBeInTheDocument();
  });

  it('should display the correct image caption from first section', () => {
    renderComponent();
    expect(screen.getByText(mockHearingWithSections.data.sections[0].images[0].caption.fi)).toBeInTheDocument();
  });

  it('should render correctly when user is admin', () => {
    const mockAdminUser = {
      ...mockData.mockUser,
      adminOrganizations: [mockData.mockHearingWithSections.data.organization],
    };

    renderComponent({ user: { data: mockAdminUser } });
  });

  it('should toggle accordions', async () => {
    renderComponent({
      hearing: {
        [mockData.mockHearingWithSections.data.id]: {
          data: {
            ...mockData.mockHearingWithSections.data,
            sections: mockData.mockHearingWithSections.data.sections.map((section) => ({
              ...section,
              files: [{ id: uniqueId(), url: 'https://test.fi', title: { fi: 'testi.pdf' }, caption: {} }],
            })),
          },
        },
      },
    });

    const toggleButtons = await screen.findAllByRole('button');
    const filteredButtons = toggleButtons.filter((button) => button.hasAttribute('aria-expanded'));
    const currentExpanded = toggleButtons.map((button) => button.getAttribute('aria-expanded'));

    filteredButtons.forEach(async (button) => fireEvent.click(button));

    filteredButtons.forEach((button, index) =>
      expect(button.getAttribute('aria-expanded')).not.toEqual(currentExpanded[index]),
    );
  });

  it('should handle report download', async () => {
    const mockAdminUser = {
      ...mockData.mockUser,
      adminOrganizations: [mockData.mockHearingWithSections.data.organization],
    };

    renderComponent({ user: { data: mockAdminUser } });

    window.URL.createObjectURL = vi.fn(() => 'https://test.com');
    window.URL.revokeObjectURL = vi.fn();

    //

    const mockBlob = new Blob(['test data'], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    vi.spyOn(mockApi, 'get').mockImplementationOnce((url) => {
      if (url.includes('/report')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          blob: () => Promise.resolve(mockBlob),
        });
      }

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockedData),
        blob: () => Promise.resolve({}),
      });
    });

    const downloadButton = await screen.findByRole('button', { name: /downloadReport/i });

    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1);
    });
  });

  it('should render with empty sections', async () => {
    renderComponent({
      hearing: {
        [mockData.mockHearingWithSections.data.id]: {
          data: {
            ...mockData.mockHearingWithSections.data,
            sections: [
              { ...mockData.mockHearingWithSections.data.sections[0], abstract: {}, content: {}, images: [] },
              { ...mockData.mockHearingWithSections.data.sections[1], abstract: {}, content: {}, images: [] },
            ],
          },
        },
      },
    });
  });

  it('should render with empty contacts', async () => {
    renderComponent({
      hearing: {
        [mockData.mockHearingWithSections.data.id]: {
          data: {
            ...mockData.mockHearingWithSections.data,
            contact_persons: [],
          },
        },
      },
    });
  });
});
