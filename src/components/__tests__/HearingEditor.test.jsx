import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { UnconnectedHearingEditor } from "../admin/HearingEditor";
import renderWithProviders from "../../utils/renderWithProviders";
import { getIntlAsProp } from '../../../test-utils';


const renderComponent = (props = {}) => {
    const finalProps = {
        fetchEditorContactPersons: jest.fn(),
        hearing: {},
        ...props
    }
    return renderWithProviders(
        <MemoryRouter>
            <UnconnectedHearingEditor intl={getIntlAsProp()} {...finalProps} />
        </MemoryRouter>,
    );
};

describe('Hearing Editor', () => {
    it('should render correctly', () => {
        renderComponent();
    })
})