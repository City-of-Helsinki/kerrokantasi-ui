import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import renderWithProviders from "../src/utils/renderWithProviders";
import App from "../src/App";

describe('App', () => {
    test('Component renders', () => {
        renderWithProviders(<MemoryRouter><App /></MemoryRouter>)
    })
});