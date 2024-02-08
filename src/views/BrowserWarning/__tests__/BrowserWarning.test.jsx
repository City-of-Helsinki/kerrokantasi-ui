import React from 'react';
import { render, waitFor } from '@testing-library/react';

import BrowserWarning from '..';

const BROWSER_WARNING_CONTAINER_CLASS = '.browser-warning-text-container';

const renderComponent = () => render(<BrowserWarning />);

describe('<BrowserWarning />', () => {
  it('contains Helmet title', async () => {
    renderComponent();

    await waitFor(() => expect(document.title).toBe('Kerrokantasi'));
  });

  it('contains h1 heading', () => {
    const { getByRole } = renderComponent();

    const heading = getByRole('heading', { name: 'Kerrokantasi' });

    expect(heading).toBeInTheDocument();
  });

  it('contains correct amount of text containers, 1 for each language so 3 in total', () => {
    const { container } = renderComponent();

    const textContainers = container.querySelectorAll(BROWSER_WARNING_CONTAINER_CLASS);

    expect(textContainers).toHaveLength(3);
  });

  it('contains 2 p elements per language', () => {
    const { container } = renderComponent();

    const textContainers = container.querySelectorAll(BROWSER_WARNING_CONTAINER_CLASS);

    const finnishTexts = textContainers[0].querySelectorAll('p');
    const swedishTexts = textContainers[1].querySelectorAll('p');
    const englishTexts = textContainers[2].querySelectorAll('p');

    expect(finnishTexts).toHaveLength(2);
    expect(swedishTexts).toHaveLength(2);
    expect(englishTexts).toHaveLength(2);
  });

  it('contains 3 links per language', () => {
    const { container } = renderComponent();

    const textContainers = container.querySelectorAll(BROWSER_WARNING_CONTAINER_CLASS);

    const finnishLinks = textContainers[0].querySelectorAll('a');
    const swedishLinks = textContainers[1].querySelectorAll('a');
    const englishLinks = textContainers[2].querySelectorAll('a');

    expect(finnishLinks).toHaveLength(3);
    expect(swedishLinks).toHaveLength(3);
    expect(englishLinks).toHaveLength(3);
  });
});
