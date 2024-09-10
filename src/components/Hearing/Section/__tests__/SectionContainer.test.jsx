/* eslint-disable sonarjs/no-duplicate-string */
import React from 'react';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { uniqueId } from 'lodash';

import SectionContainerComponent from '../SectionContainer';
import { mockStore as mockData } from '../../../../../test-utils';
import renderWithProviders from '../../../../utils/renderWithProviders';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const mockedData = {
  results: [],
};
jest.mock('../../../../api', () => {
  const actual = jest.requireActual('../../../../api');

  return {
    getApiURL: actual.getApiURL,
    getApiTokenFromStorage: jest.fn().mockReturnValue('dummyToken'),
    get: jest
      .fn()
      .mockResolvedValue({ ok: true, json: () => Promise.resolve(mockedData), blob: () => Promise.resolve() }),
  };
});

const renderComponent = (storeOverrides) => {
  const { mockHearingWithSections, mockUser, sectionComments } = mockData;

  const store = mockStore({
    hearing: {
      [mockHearingWithSections.data.slug]: {
        data: mockHearingWithSections.data,
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
      [mockHearingWithSections.data.slug]: {
        data: mockHearingWithSections.data,
      },
    },
    match: {
      params: {
        hearingSlug: mockHearingWithSections.data.slug,
      },
    },
    location: {
      pathname: `/${mockHearingWithSections.data.slug}`,
    },
    fetchCommentsForSortableList: jest.fn(),
  };

  return renderWithProviders(
    <BrowserRouter>
      <SectionContainerComponent {...props} />
    </BrowserRouter>,
    { store },
  );
};

describe('<SectionContainer />', () => {
  it('should render correctly', () => {
    renderComponent();
  });

  it('should render correctly when user is admin', () => {
    const mockUser = { ...mockData.mockUser, adminOrganizations: [mockData.mockHearingWithSections.data.organization] };

    renderComponent({ user: { data: mockUser } });
  });

  it('should toggle accordions', async () => {
    const mockUser = { ...mockData.mockUser, adminOrganizations: [mockData.mockHearingWithSections.data.organization] };

    renderComponent({
      user: { data: mockUser },
      hearing: {
        [mockData.mockHearingWithSections.data.slug]: {
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
    const mockUser = { ...mockData.mockUser, adminOrganizations: [mockData.mockHearingWithSections.data.organization] };

    renderComponent({ user: { data: mockUser } });

    const downloadButton = await screen.findByText(/downloadReport/i);
    fireEvent.click(downloadButton);

    window.URL.createObjectURL = jest.fn(() => 'https://test.com');

    await waitFor(() => expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1));
  });

  it('should render with empty sections', async () => {
    renderComponent({
      hearing: {
        [mockData.mockHearingWithSections.data.slug]: {
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
        [mockData.mockHearingWithSections.data.slug]: {
          data: {
            ...mockData.mockHearingWithSections.data,
            contact_persons: [],
          },
        },
      },
    });
  });
});
