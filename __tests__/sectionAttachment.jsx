import React from 'react';
import { shallow } from 'enzyme';

import SectionAttachment, { getFileTitle } from '../src/components/Hearing/Section/SectionAttachment';

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

let wrapper;

describe('<SectionAttachment />', () => {
  beforeEach(() => {
    wrapper = shallow(<SectionAttachment {...props} />);
  });

  test('Should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('Should render the component', () => {
    expect(wrapper.find('.section-attachment').length).toBe(1);
  });

  test('Should get the right file name based on language', () => {
    const title = getFileTitle(props.file.title, props.language);
    expect(title).toBe(props.file.title.fi);
  });

  test('Should get English language title when language is english', () => {
    const title = getFileTitle(props.file.title, 'en');
    expect(title).toBe(props.file.title.en);
  });
});
