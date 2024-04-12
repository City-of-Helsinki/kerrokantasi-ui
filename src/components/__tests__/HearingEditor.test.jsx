import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { UnconnectedHearingEditor } from "../admin/HearingEditor";
import renderWithProviders from "../../utils/renderWithProviders";
import { getIntlAsProp } from '../../../test-utils';


const renderComponent = (props = {}) => {
    props['fetchEditorContactPersons'] = jest.fn();
    props['hearing'] = {};
    return renderWithProviders(
        <MemoryRouter>
            <UnconnectedHearingEditor intl={getIntlAsProp()} {...props} />
        </MemoryRouter>,
    );
};

describe('Hearing Editor', () => {
    it('should render correctly', () => {
        renderComponent();
    })
})