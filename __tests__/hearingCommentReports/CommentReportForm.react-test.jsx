import React from 'react';
import { shallow } from 'enzyme';
import { ControlLabel, Form, FormControl, FormGroup } from 'react-bootstrap';
import { Button } from 'hds-react';
import { FormattedMessage } from 'react-intl';

import { UnconnectedCommentReportForm as CommentReportForm } from '../../src/components/CommentReportModal/CommentReportForm';
import { mockStore } from '../../test-utils';
import { FILE_FORMATS } from '../../src/components/CommentReportModal/constants';
import Icon from '../../src/utils/Icon';

describe('CommentReportForm', () => {
  const defaultProps = {
    apiToken: { apiInitialized: true, apiToken: '123-abc', isFetching: false, loadingToken: false },
    hearing: mockStore.mockHearingWithSections,
    language: 'fi',
  };

  function getWrapper(props) {
    return shallow(<CommentReportForm {...defaultProps} {...props} />);
  }
  describe('renders', () => {
    test('wrapping form', () => {
      const form = getWrapper().find(Form);
      expect(form).toHaveLength(1);
    });

    describe('file format select', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      const formGroup = wrapper.find(FormGroup);

      test('form group', () => {
        expect(formGroup).toHaveLength(1);
        expect(formGroup.prop('controlId')).toBe('file-format-select');
      });

      test('label', () => {
        const label = formGroup.find(ControlLabel);
        expect(label).toHaveLength(1);
      });

      test('label text', () => {
        const text = formGroup.find(ControlLabel).find(FormattedMessage);
        expect(text).toHaveLength(1);
        expect(text.prop('id')).toBe('commentReportsSelectFileType');
      });

      test('form control', () => {
        const formControl = formGroup.find(FormControl);
        expect(formControl).toHaveLength(1);
        expect(formControl.prop('componentClass')).toBe('select');
        expect(formControl.prop('onChange')).toBe(instance.handleFileFormatChange);
        expect(formControl.prop('value')).toBe(instance.state.fileFormat);
      });

      test('form control options', () => {
        const options = formGroup.find(FormControl).find('option');
        expect(options).toHaveLength(Object.keys(FILE_FORMATS).length);
        Object.values(FILE_FORMATS).forEach((format, index) => {
          expect(options.at(index).prop('value')).toBe(format.id);
          expect(options.at(index).text()).toBe(format.name);
        });
      });
    });

    describe('download button', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      const button = wrapper.find(Button);

      test('button', () => {
        expect(button).toHaveLength(1);
        expect(button.prop('onClick')).toBe(instance.handleDownloadClick);
        expect(button.prop('type')).toBe('submit');
      });

      test('icon', () => {
        const icon = button.find(Icon);
        expect(icon).toHaveLength(1);
        expect(icon.prop('name')).toBe('download');
        expect(icon.prop('aria-hidden')).toBe('true');
      });

      test('text', () => {
        const text = button.find(FormattedMessage);
        expect(text).toHaveLength(1);
        expect(text.prop('id')).toBe('commentReportsDownload');
      });
    });
  });

  describe('functions', () => {
    describe('handleFileFormatChange', () => {
      test('calls setState with correct params', () => {
        const instance = getWrapper().instance();
        const event = { target: { value: 'test-value' } };
        const spy = jest.spyOn(instance, 'setState');
        instance.handleFileFormatChange(event);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({ fileFormat: event.target.value });
      });
    });
  });
});
