import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import { ClosureInfo } from '../ClosureInfo';

const renderComponent = (propOverrides) => {
  const props = { closureInfo: '<p>A very awesome closure info here.</p>', ...propOverrides };

  return render(
    <MemoryRouter>
      <ClosureInfo {...props} />
    </MemoryRouter>,
  );
};

describe('<ClosureInfo />', () => {
  it('should render correctly', () => {
    renderComponent();
  });
});
