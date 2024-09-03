import React from 'react';
import { render } from '@testing-library/react';
import { FormattedMessage } from 'react-intl';

import SectionAttachment, { getFileTitle } from '../SectionAttachment';

const props = {
  language: 'fi',
  file: {
    url: 'http://mock.url',
    title: {
      fi: 'Title in finnish',
      en: 'Title in english',
    },
  },
};

const renderComponent = () => render(<SectionAttachment {...props} />);

describe('<SectionAttachment />', () => {
  it('should render correctly', () => {
    renderComponent();
  });

  it('should get the right file name based on language', () => {
    const title = getFileTitle(props.file.title, props.language);

    expect(title).toBe(props.file.title.fi);
  });

  it('should get English language title when language is english', () => {
    const title = getFileTitle(props.file.title, 'en');

    expect(title).toBe(props.file.title.en);
  });

  it('should return default title', () => {
    const title = getFileTitle({}, 'asdf');

    expect(title).toStrictEqual(<FormattedMessage id='attachment' />);
  });
});
