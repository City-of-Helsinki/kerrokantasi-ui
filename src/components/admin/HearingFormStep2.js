import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import uuid from 'uuid/v1';
import {head} from 'lodash';

import Accordion from 'react-bootstrap/lib/Accordion';
import Button from 'react-bootstrap/lib/Button';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Panel from 'react-bootstrap/lib/Panel';
import Icon from '../../utils/Icon';

import SectionForm from './SectionForm';
import {addSection, removeSection} from '../../actions/hearingEditor';
import {getMainSection} from '../../utils/hearing';
import {hearingShape} from '../../types';
import {initNewSection, SectionTypes} from '../../utils/section';
import getAttr from '../../utils/getAttr';

class HearingFormStep2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSection: getMainSection(props.hearing).frontId
    };
    this.addSection = this.addSection.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.sectionSequence = 0;
  }

  getDeleteSectionButton(section, sectionID) {
    if (section.type !== "main") {
      return (
        <Button
          bsStyle="danger"
          onClick={() => this.deleteSection(sectionID)}
        >
          <Icon className="icon" name="trash"/> <FormattedMessage id="deleteSection"/>
        </Button>
      );
    }
    return null;
  }

  /*
  * Get element for each hearing section.
  * @returns {Array} - Array of Panel elements.
   */
  getSections() {
    const {language} = this.context;
    const {hearing, hearingLanguages, sectionMoveUp, sectionMoveDown} = this.props;
    return hearing.sections
      .filter(({type}) => type !== SectionTypes.CLOSURE)
      .map((section, index) => {
        const sectionHeader = this.props.intl.formatMessage({
          id: `${section.type}Section`
        });
        const sectionID = section.frontId;
        return (
          <Panel
            eventKey={sectionID}
            header={`${sectionHeader}: ${getAttr(section.title, language) || ''}`}
            key={sectionID}
            bsStyle="info"
          >
            <SectionForm
              section={section}
              onSectionChange={this.props.onSectionChange}
              onSectionImageChange={this.props.onSectionImageChange}
              sectionLanguages={hearingLanguages}
              sectionMoveUp={sectionMoveUp}
              sectionMoveDown={sectionMoveDown}
              isFirstSubsection={index === 1}
              isLastSubsection={index === (hearing.sections.length - 1)}
            />
            <div className="section-toolbar">
              {this.getDeleteSectionButton(section, sectionID)}
            </div>
          </Panel>
        );
      });
  }

  static scrollModalToTop = () => {
    if (document && document.getElementsByClassName) {
      const modal = head(document.getElementsByClassName('modal'));
      if (modal) {
        modal.scrollTop = 0;
      }
    }
  };

  handleSelect(activeSection) {
    if (activeSection === this.state.activeSection) {
      this.setState({activeSection: ''}, HearingFormStep2.scrollModalToTop);
    } else {
      this.setState({activeSection}, HearingFormStep2.scrollModalToTop);
    }
  }

  /*
  * Add new section to the hearing
  * @param {str} type - Type of the new section to be created
   */
  addSection(type) {
    const newSection = initNewSection();
    newSection.frontId = uuid();
    newSection.type = type;
    this.props.dispatch(addSection(newSection));
    this.setState({activeSection: newSection.frontId}, HearingFormStep2.scrollModalToTop);
  }

  /*
  * Remove section with given id.
  * @param {str} sectionID
   */
  deleteSection(sectionID) {
    const { sections } = this.props.hearing;
    this.props.dispatch(removeSection(sectionID));
    this.setState({activeSection: sections[sections.length - 2].frontId}, HearingFormStep2.scrollModalToTop);
  }

  render() {
    return (
      <div className="form-step">
        <Accordion activeKey={this.state.activeSection} onSelect={this.handleSelect}>
          {this.getSections()}
        </Accordion>
        <div className="new-section-toolbar">
          <ButtonToolbar>
            <Button
              bsSize="small"
              bsStyle="default"
              onClick={() => this.addSection("part")}
            >
              <Icon className="icon" name="plus"/> <FormattedMessage id="addSection"/>
            </Button>
          </ButtonToolbar>
        </div>
        <div className="step-footer">
          <Button
            bsStyle="default"
            onClick={this.props.onContinue}
          >
            <FormattedMessage id="hearingFormNext"/>
          </Button>
        </div>
      </div>
    );
  }
}


HearingFormStep2.propTypes = {
  dispatch: PropTypes.func,
  hearing: hearingShape,
  hearingLanguages: PropTypes.arrayOf(PropTypes.string),
  intl: intlShape.isRequired,
  onContinue: PropTypes.func,
  onSectionChange: PropTypes.func,
  onSectionImageChange: PropTypes.func,
  sectionMoveUp: PropTypes.func,
  sectionMoveDown: PropTypes.func
};

HearingFormStep2.contextTypes = {
  language: PropTypes.string
};

const WrappedHearingFormStep2 = connect()(injectIntl(HearingFormStep2));

export default WrappedHearingFormStep2;
