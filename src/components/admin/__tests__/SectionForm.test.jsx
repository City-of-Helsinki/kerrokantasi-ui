import React from 'react';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import { fireEvent, screen } from '@testing-library/react';

import SectionForm from '../SectionForm';
import renderWithProviders from '../../../utils/renderWithProviders';
import { getIntlAsProp, mockStore as mockData } from '../../../../test-utils';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

jest.mock('hds-react', () => {
  const actual = jest.requireActual('hds-react');

  return {
    ...actual,
    FileInput: jest.fn().mockImplementation(() => <div>FileInput</div>),
  };
});

const storeInitialState = { language: 'fi' };
const { mockHearingWithSections } = mockData;

const renderComponent = (propOverrides, storeOverride) => {
  const props = {
    section: { ...mockHearingWithSections.data.sections[0], frontId: mockHearingWithSections.data.sections[0].id },
    sectionLanguages: ['fi'],
    onSectionChange: jest.fn(),
    intl: getIntlAsProp(),
    ...propOverrides,
  };

  const store = storeOverride || mockStore(storeInitialState);

  return renderWithProviders(<SectionForm {...props} />, { store });
};

describe('<SectionForm />', () => {
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

  it('should call onSectionChange when title is changed', () => {
    const onSectionChange = jest.fn();

    renderComponent({
      onSectionChange,
      section: { ...mockHearingWithSections.data.sections[1], frontId: mockHearingWithSections.data.sections[1].id },
    });

    const titleInput = screen.getAllByLabelText('inLanguage-fi')[0];

    fireEvent.blur(titleInput, { target: { value: 'New Title' } });

    expect(onSectionChange).toHaveBeenCalledWith(expect.anything(), 'title', { fi: 'New Title' });
  });

  it('should toggle commenting map tools', async () => {
    const onSectionChange = jest.fn();

    renderComponent({ onSectionChange });

    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(checkbox);

    expect(onSectionChange).toHaveBeenCalledWith(expect.anything(), 'commenting_map_tools', 'none');
  });

  it('should call sectionMoveUp when move up button is clicked', () => {
    const sectionMoveUp = jest.fn();

    renderComponent({
      sectionMoveUp,
      isFirstSubsection: false,
      section: { ...mockHearingWithSections.data.sections[1], frontId: mockHearingWithSections.data.sections[1].id },
    });

    const button = screen.getByText('moveUp', { exact: false });

    fireEvent.click(button);

    expect(sectionMoveUp).toHaveBeenCalled();
  });

  it('should call sectionMoveDown when move down button is clicked', () => {
    const sectionMoveDown = jest.fn();

    renderComponent({
      sectionMoveDown,
      isLastSubsection: false,
      section: { ...mockHearingWithSections.data.sections[1], frontId: mockHearingWithSections.data.sections[1].id },
    });

    const button = screen.getByText('moveDown', { exact: false });

    fireEvent.click(button);

    expect(sectionMoveDown).toHaveBeenCalled();
  });

  it('should call initSingleChoiceQuestion when new single choice question button is clicked', () => {
    const initSingleChoiceQuestion = jest.fn();

    renderComponent({ initSingleChoiceQuestion });

    const button = screen.getByText('newSingleChoiceQuestion');

    fireEvent.click(button);

    expect(initSingleChoiceQuestion).toHaveBeenCalled();
  });

  it('should call initMultipleChoiceQuestion when new multiple choice question button is clicked', () => {
    const initMultipleChoiceQuestion = jest.fn();

    renderComponent({ initMultipleChoiceQuestion });

    const button = screen.getByText('newMultipleChoiceQuestion');

    fireEvent.click(button);

    expect(initMultipleChoiceQuestion).toHaveBeenCalled();
  });
});
