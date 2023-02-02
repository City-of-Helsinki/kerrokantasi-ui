import React from 'react';
import {shallow} from 'enzyme';
import { getIntlAsProp } from '../../test-utils';
import { FormattedMessage } from 'react-intl';
import QuestionForm from '../../src/components/QuestionForm';
import { Checkbox, FormGroup, HelpBlock, Radio } from 'react-bootstrap';

describe('QuestionForm', () => {
  const defaultProps = {
    autoFocus: false,
    question: {
      id: 10,
      is_independent_poll: false,
      n_answers: 0,
      options: [
        {id: 20, n_answers: 0, text: {fi: 'fi test one'}},
        {id: 21, n_answers: 0, text: {fi: 'fi test two'}},
        {id: 22, n_answers: 0, text: {fi: 'fi test three'}},
      ],
      text: {fi: 'fi single choice question'},
      type: 'single-choice'
    },
    lang: 'fi',
    onChange: () => {},
    answers: {
      answers: [],
      question: 10,
      type: 'single-choice'
    },
    canAnswer: true
  };

  function getWrapper(props) {
    return (shallow(<QuestionForm intl={getIntlAsProp()} {...defaultProps} {...props} />));
  }

  describe('renders', () => {
    test('FormGroup', () => {
      const formGroup = getWrapper().find(FormGroup);
      expect(formGroup).toHaveLength(1);
      expect(formGroup.prop('className')).toBe('question-form-group');
      expect(formGroup.prop('onChange')).toBeDefined();
    });

    test('fieldset', () => {
      const fieldset = getWrapper().find('fieldset');
      expect(fieldset).toHaveLength(1);
      expect(fieldset.prop('className')).toBe('question-form-fieldset');
    });

    test('legend', () => {
      const legend = getWrapper().find('legend');
      expect(legend).toHaveLength(1);
    });

    test('question label', () => {
      const label = getWrapper().find('h3');
      expect(label).toHaveLength(1);
      expect(label.prop('className')).toBe('h4 question-label');
      expect(label.text()).toBe(defaultProps.question.text.fi);
    });

    test('HelpBlock', () => {
      const help = getWrapper().find(HelpBlock);
      expect(help).toHaveLength(1);
    });

    describe('help text', () => {
      test('when question is type multi', () => {
        const question = {...defaultProps.question, ...{type: 'multiple-choice'}};
        const helpText = getWrapper({question}).find(HelpBlock).find(FormattedMessage);
        expect(helpText).toHaveLength(1);
        expect(helpText.prop('id')).toBe('questionHelpMulti');
      });

      test('when question is type single', () => {
        const question = {...defaultProps.question, ...{type: 'single-choice'}};
        const helpText = getWrapper({question}).find(HelpBlock).find(FormattedMessage);
        expect(helpText).toHaveLength(1);
        expect(helpText.prop('id')).toBe('questionHelpSingle');
      });
    });

    describe('when canAnswer is false', () => {
      const canAnswer = false;
      test('login to answer text', () => {
        const texts = getWrapper({canAnswer}).find(FormattedMessage);
        expect(texts).toHaveLength(2);
        expect(texts.at(1).prop('id')).toBe('logInToAnswer');
      });

      test('Radio', () => {
        const question = {...defaultProps.question, ...{type: 'single-choice'}};
        const radio = getWrapper({canAnswer, question}).find(Radio);
        expect(radio).toHaveLength(0);
      });

      test('Checkbox', () => {
        const question = {...defaultProps.question, ...{type: 'multiple-choice'}};
        const checkbox = getWrapper({canAnswer, question}).find(Checkbox);
        expect(checkbox).toHaveLength(0);
      });
    });

    describe('when canAnswer is true', () => {
      const canAnswer = true;

      test('Radios when question is single choice', () => {
        const question = {...defaultProps.question, ...{type: 'single-choice'}};
        const radios = getWrapper({canAnswer, question}).find(Radio);
        expect(radios).toHaveLength(3);
        radios.forEach((radio, index) => {
          expect(radio.prop('autoFocus')).toBe(false);
          expect(radio.prop('checked')).toBe(false);
          expect(radio.prop('name')).toBe("question_" + defaultProps.question.id);
          expect(radio.prop('value')).toBe(defaultProps.question.options[index].id);
          expect(radio.prop('onChange')).toBeDefined();
          expect(radio.childAt(0).text()).toBe(defaultProps.question.options[index].text.fi);
        });
      });

      test('Radios with correct autoFocus when prop autoFocus is true', () => {
        const autoFocus = true;
        const question = {...defaultProps.question, ...{type: 'single-choice'}};
        const radios = getWrapper({autoFocus, canAnswer, question}).find(Radio);
        expect(radios).toHaveLength(3);
        radios.forEach((radio, index) => {
          expect(radio.prop('autoFocus')).toBe(index === 0);
        });
      });

      test('Checkboxes when question is multiple choice', () => {
        const question = {...defaultProps.question, ...{type: 'multiple-choice'}};
        const checkboxes = getWrapper({canAnswer, question}).find(Checkbox);
        expect(checkboxes).toHaveLength(3);
        checkboxes.forEach((checkbox, index) => {
          expect(checkbox.prop('autoFocus')).toBe(false);
          expect(checkbox.prop('checked')).toBe(false);
          expect(checkbox.prop('name')).toBe("question_" + defaultProps.question.id);
          expect(checkbox.prop('value')).toBe(defaultProps.question.options[index].id);
          expect(checkbox.prop('onChange')).toBeDefined();
          expect(checkbox.childAt(0).text()).toBe(defaultProps.question.options[index].text.fi);
        });
      });

      test('Checkboxes with correct autoFocus when prop autoFocus is true', () => {
        const autoFocus = true;
        const question = {...defaultProps.question, ...{type: 'multiple-choice'}};
        const checkbox = getWrapper({autoFocus, canAnswer, question}).find(Checkbox);
        expect(checkbox).toHaveLength(3);
        checkbox.forEach((radio, index) => {
          expect(radio.prop('autoFocus')).toBe(index === 0);
        });
      });
    });
  });
});
