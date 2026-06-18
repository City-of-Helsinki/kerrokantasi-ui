import configureStore from 'redux-mock-store';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { thunk, mockStore as mockData } from '../../../../test-utils';
import HearingFormStep1 from '../HearingFormStep1';
import renderWithProviders from '../../../utils/renderWithProviders';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const renderComponent = (propOverrides) => {
  const { labels, mockHearingWithSections } = mockData;

  const props = {
    hearing: { title: { fi: '' }, labels: [], contact_persons: [], slug: '' },
    labels: labels.data,
    contactPersons: mockHearingWithSections.data.contact_persons,
    hearingLanguages: ['fi'],
    onLanguagesChange: vi.fn(),
    onHearingChange: vi.fn(),
    onContinue: vi.fn(),
    errors: {},
    organizations: [],
    ...propOverrides,
  };

  const store = mockStore({ language: 'fi' });

  return renderWithProviders(<HearingFormStep1 {...props} />, { store });
};

describe('<HearingFormStep1 />', () => {
  it('should render correctly', () => {
    renderComponent();
  });

  it('should open label modal when add label button is clicked', async () => {
    renderComponent();

    const addLabelBtn = await screen.findByTestId('add-new-label');
    await act(async () => {
      fireEvent.click(addLabelBtn);
    });

    expect(screen.getByText('createLabel')).toBeInTheDocument();
  });

  it('should open contact modal when add contact button is clicked', async () => {
    renderComponent();

    const addContactBtn = await screen.findByTestId('add-new-contact');
    await act(async () => {
      fireEvent.click(addContactBtn);
    });

    expect(screen.getByText('createContact')).toBeInTheDocument();
  });

  it('should call onHearingChange when title is changed', async () => {
    const onHearingChange = vi.fn();

    renderComponent({ onHearingChange });

    const inputs = await screen.findAllByRole('textbox');
    const input = inputs[0];

    fireEvent.blur(input, { target: { value: 'New Title' } });

    await waitFor(() =>
      expect(onHearingChange).toHaveBeenCalledWith('title', { fi: 'New Title' })
    );
  });

  it('should call onHearingChange when labels are changed', async () => {
    const { labels } = mockData;
    const onHearingChange = vi.fn();
    const user = userEvent.setup();
    const { container } = renderComponent({ onHearingChange });

    const dropdownButton = container.querySelector('#labels-main-button');
    expect(dropdownButton).toBeInTheDocument();

    // Open the dropdown
    await act(async () => {
      await user.click(dropdownButton);
    });

    // Wait for the option to appear and click it
    const option = await screen.findByText(labels.data[0].label.fi);
    expect(option).toBeInTheDocument();

    await act(async () => {
      await user.click(option);
    });

    await waitFor(() => {
      expect(onHearingChange).toHaveBeenCalledWith('labels', [
        labels.data[0].id,
      ]);
    });
  });

  it('should call onHearingChange when contacts are changed', async () => {
    const { mockHearingWithSections } = mockData;
    const onHearingChange = vi.fn();
    const user = userEvent.setup();
    const { container } = renderComponent({ onHearingChange });

    const dropdownButton = container.querySelector(
      '#contact_persons-main-button'
    );
    expect(dropdownButton).toBeInTheDocument();

    await act(async () => {
      await user.click(dropdownButton);
    });
    const option = await screen.findByText(
      mockHearingWithSections.data.contact_persons[0].name
    );
    expect(option).toBeInTheDocument();
    await act(async () => {
      await user.click(option);
    });

    await waitFor(() => {
      expect(onHearingChange).toHaveBeenCalledWith('contact_persons', [
        mockHearingWithSections.data.contact_persons[0].id,
      ]);
    });
  });

  it('should keep keyboard-selected labels visible after moving focus to slug', async () => {
    const { labels } = mockData;
    const user = userEvent.setup();
    const { container, rerender } = renderComponent();

    const dropdownButton = container.querySelector('#labels-main-button');
    const slugInput = screen.getByRole('textbox', { name: /hearingSlug/i });

    expect(dropdownButton).toBeInTheDocument();
    expect(slugInput).toBeInTheDocument();

    await act(async () => {
      dropdownButton.focus();
      await user.keyboard('[Enter]');
      await user.keyboard('[ArrowDown]');
      await user.keyboard('[Enter]');
      await user.keyboard('[Tab]');
      await user.type(slugInput, 'slug-value');
    });

    rerender(
      <HearingFormStep1
        hearing={{
          title: { fi: '' },
          labels: [labels.data[0]],
          contact_persons: [],
          slug: 'slug-value',
        }}
        labels={labels.data}
        contactPersons={mockData.mockHearingWithSections.data.contact_persons}
        hearingLanguages={['fi']}
        onLanguagesChange={vi.fn()}
        onHearingChange={vi.fn()}
        onContinue={vi.fn()}
        errors={{}}
        organizations={[]}
      />
    );

    await waitFor(() => {
      expect(dropdownButton).toHaveTextContent(labels.data[0].label.fi);
    });
  });

  it('should call onContinue when continue button is clicked', async () => {
    const onContinue = vi.fn();

    renderComponent({ onContinue });

    await act(async () => {
      fireEvent.click(screen.getByText(/hearingFormNext/i));
    });

    expect(onContinue).toHaveBeenCalled();
  });

  it('should call onContinue when continue button is activated with keyboard', async () => {
    const onContinue = vi.fn();
    const user = userEvent.setup();

    renderComponent({ onContinue });

    const button = screen.getByRole('button', { name: /hearingFormNext/i });
    button.focus();

    await user.keyboard('[Enter]');

    expect(onContinue).toHaveBeenCalledTimes(1);
  });
});
