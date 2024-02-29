import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import IframeEntity from '../IframeEntity';
import renderWithProviders from '../../../../utils/renderWithProviders';

const renderComponent = (propOverrides) => {
  const entity = {
    data: {
      title: 'some title',
      src: 'https://google.fi',
    },
    entityKey: 'IFRAME',
    getData() {
      return this.data;
    },
  };

  const contentState = { getEntity: () => entity };

  const props = {
    contentState,
    entityKey: 'IFRAME',
    ...propOverrides,
  };

  return renderWithProviders(
    <MemoryRouter>
      <IframeEntity {...props} />
    </MemoryRouter>,
  );
};

describe('<IframeEntity />', () => {
  it('should render correctly', () => {
    const { container } = renderComponent();

    expect(container).toMatchSnapshot();
  });
});
