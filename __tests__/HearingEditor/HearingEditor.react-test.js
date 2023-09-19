import React from 'react';
import {UnconnectedHearingEditor} from '../../src/components/admin/HearingEditor';
import {getIntlAsProp, mockStore, mockUser} from '../../test-utils';
import {shallow} from 'enzyme';
import {notifyError} from '../../src/utils/notify';

jest.mock('../../src/utils/notify');

const defaultProps = {
  contactPersons: mockStore.hearing.mockHearing.data.contact_persons,
  dispatch: jest.fn(),
  show: true,
  hearing: mockStore.hearing.mockHearing.data,
  hearingLanguages: ['fi'],
  labels: [{id: 1, label: 'text'}],
  user: mockUser,
  language: 'fi',
  isNewHearing: true,
  fetchEditorContactPersons: jest.fn(),
};

describe('HearingEditor', () => {
  function getWrapper(props) {
    return shallow(<UnconnectedHearingEditor intl={getIntlAsProp()} {...defaultProps} {...props} />);
  }
  test('validateHearing', () => {
    const hearingWithErrors = {
      title: {
        fi: 'yksi',
        sv: '',
      },
      labels: [{id: 1, label: {fi: 'labelSuomeksi', sv: 'labelSvenska'}}],
      slug: 'urlSlug',
      contact_persons: mockStore.hearing.mockHearing.data.contact_persons,
      open_at: '2021-05-12T21:00:00Z',
      close_at: '2021-11-28T22:00:00Z',
      project: {
        title: {fi: 'nimi', sv: 'namn'},
        phases: [
          {
            title: {fi: 'vaihe', sv: 'fas'},
            is_active: true,
          }
        ]
      }
    };
    const wrapper = getWrapper({hearingLanguages: ['fi', 'sv']});
    const instance = wrapper.instance();
    const mockCallBack = jest.fn();

    // if only title is missing
    instance.validateHearing(hearingWithErrors, mockCallBack);
    expect(notifyError).toHaveBeenCalled();
    let stateKeys = Object.values(wrapper.state('errors'));
    expect(Object.keys(stateKeys[0]).includes('title')).toBe(true);

    hearingWithErrors.title.sv = 'ett';
    hearingWithErrors.open_at = null;

    // if only opening time is missing
    instance.validateHearing(hearingWithErrors, mockCallBack);
    stateKeys = Object.values(wrapper.state('errors'));
    expect(Object.keys(stateKeys[1]).includes('open_at')).toBe(true);

    hearingWithErrors.open_at = '2021-05-12T21:00:00Z';
    hearingWithErrors.project.phases[0].is_active = false;

    // if only active project phase is missing
    instance.validateHearing(hearingWithErrors, mockCallBack);
    stateKeys = Object.values(wrapper.state('errors'));
    expect(Object.keys(stateKeys[2]).includes('project_phase_active')).toBe(true);

    // everything required is missing
    hearingWithErrors.title.fi = '';
    hearingWithErrors.labels = [];
    hearingWithErrors.slug = '';
    hearingWithErrors.contact_persons = [];
    hearingWithErrors.open_at = null;
    hearingWithErrors.close_at = null;
    hearingWithErrors.project.title.sv = '';
    hearingWithErrors.project.phases[0].title.fi = '';

    instance.validateHearing(hearingWithErrors, mockCallBack);
    stateKeys = Object.values(wrapper.state('errors'));
    const step1StateKeys = Object.keys(stateKeys[0]);
    const step4StateKeys = Object.keys(stateKeys[1]);
    const step5StateKeys = Object.keys(stateKeys[2]);
    const step1ExpectedErrors = ['title', 'labels', 'slug', 'contact_persons'];
    const step4ExpectedErrors = ['open_at', 'close_at'];
    const step5ExpectedErrors = ['project_title', 'project_phase_title', 'project_phase_active'];
    step1ExpectedErrors.forEach((key) => {
      expect(step1StateKeys.includes(key)).toBe(true);
    });
    step4ExpectedErrors.forEach((key) => {
      expect(step4StateKeys.includes(key)).toBe(true);
    });
    step5ExpectedErrors.forEach((key) => {
      expect(step5StateKeys.includes(key)).toBe(true);
    });
    expect(step1StateKeys.includes('title')).toBe(true);
    expect(Object.keys(stateKeys[2]).includes('project_phase_active')).toBe(true);
  });
});
