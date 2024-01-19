import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import renderWithProviders from "../src/utils/renderWithProviders";
import NewHearingContainer from '../src/views/NewHearing/NewHearingContainer';

const mockProps = {
    fetchEditorMetaData: jest.fn(),
    initHearing: jest.fn(),
    fetchProjectsList: jest.fn()
}

describe('NewHearingContainer', () => {
    test('Component renders', () => {
        renderWithProviders(<MemoryRouter><NewHearingContainer props={mockProps} /></MemoryRouter>)
    })
});