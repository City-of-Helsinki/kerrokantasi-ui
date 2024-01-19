import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import renderWithProviders from "../src/utils/renderWithProviders";
import SilentRenew from '../src/views/Auth/silentRenew';

describe('Silent Renew', () => {
    test('Component renders', () => {
        renderWithProviders(<MemoryRouter><SilentRenew /></MemoryRouter>)
    })
});