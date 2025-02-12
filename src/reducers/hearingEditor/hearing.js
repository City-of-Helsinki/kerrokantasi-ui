import { combineReducers } from 'redux';
import updeep from 'updeep';
import { combineActions, handleActions } from 'redux-actions';
import { head, findIndex } from 'lodash';

import { moveSubsectionInArray, initNewPhase, initNewProject } from '../../utils/hearingEditor';
import { EditorActions } from '../../actions/hearingEditor';

const sectionMoveUp = (sections, sectionId) => {
  const sectionIndex = findIndex(sections, (el) => el === sectionId);
  return moveSubsectionInArray(sections, sectionIndex, -1);
};

const sectionMoveDown = (sections, sectionId) => {
  const sectionIndex = findIndex(sections, (el) => el === sectionId);
  return moveSubsectionInArray(sections, sectionIndex, 1);
};

const data = handleActions(
  {
    [EditorActions.RECEIVE_HEARING]: (state, { payload: { result, entities } }) => entities.hearing[result],
    // Weird way of getting the normalized hearing when the hearing actually was normalized without any identifier
    [EditorActions.INIT_NEW_HEARING]: (state, { payload: { entities } }) =>
      entities.hearing[head(Object.keys(entities.hearing))],
    [EditorActions.EDIT_HEARING]: (state, { payload: { field, value } }) => ({ ...state, [field]: value }),
    [EditorActions.CREATE_MAP_MARKER]: (state, { payload: { value } }) => ({
      ...state,
      geojson: value.geometry,
    }),
    [EditorActions.ADD_MAP_MARKER]: (state, { payload: { value } }) => {
      const foo = state.geojson;

      return {
        ...state, geojson: {
          type: 'FeatureCollection',
          features: [{ type: 'Feature', geometry: foo }, { ...value }]
        }
      };
    },
    [EditorActions.ADD_MAP_MARKER_TO_COLLECTION]: (state, { payload: { value } }) =>
      updeep({
        geojson: {
          features: [...state.geojson.features, { ...value }]
        }
      }, state),
    [EditorActions.ADD_SECTION]: (state, { payload: { section } }) => ({
      ...state,
      sections: [...state.sections, section.frontId],
    }),
    [EditorActions.REMOVE_SECTION]: (state, { payload: { sectionID } }) => ({
      ...state,
      sections: state.sections.filter(id => id !== sectionID),
    }),
    [EditorActions.UPDATE_HEARING_AFTER_SAVE]: (state, { payload: { result, entities } }) => ({
      ...state,
      ...entities.hearing[result],
    }),
    [EditorActions.ADD_LABEL_SUCCESS]: (state, { payload: { label } }) =>
      updeep({ labels: [state.labels.push(label.id)] }, state),
    [EditorActions.SECTION_MOVE_UP]: (state, { payload: sectionId }) =>
      updeep({ sections: sectionMoveUp(state.sections, sectionId) }, state),
    [EditorActions.SECTION_MOVE_DOWN]: (state, { payload: sectionId }) =>
      updeep({ sections: sectionMoveDown(state.sections, sectionId) }, state),
    [EditorActions.ADD_PHASE]: (state) =>
      updeep({
        project: {
          phases: [...state.project.phases, initNewPhase()]
        }
      }, state),
    [EditorActions.DELETE_PHASE]: (state, { payload: { phaseId } }) =>
      updeep({
        project: {
          phases: state.project.phases.filter(phase => phase.id !== phaseId && phase.frontId !== phaseId)
        }
      }, state),
    [EditorActions.ACTIVE_PHASE]: (state, { payload: { phaseId } }) =>
      updeep({
        project: {
          phases: state.project.phases.map(phase => {
            if (phase.id === phaseId || phase.frontId === phaseId) {
              return updeep({ is_active: true }, phase);
            }
            return updeep({ is_active: false }, phase);
          })
        }
      }, state),
    [EditorActions.EDIT_PHASE]: (state, { payload: {
      phaseId,
      fieldName,
      language,
      value
    } }) =>
      updeep({
        project: {
          phases: state.project.phases.map(phase => {
            if (phase.id === phaseId || phase.frontId === phaseId) {
              return updeep({ [fieldName]: { [language]: value } }, phase);
            }
            return phase;
          })
        }
      }, state),
    [EditorActions.CHANGE_PROJECT]: (state, { payload: { hearingSlug, projectId, projectLists } }) => {
      let updatedProject;
      if (projectId === '') {
        updatedProject = initNewProject()
      } else {
        updatedProject = projectLists.find(project => project.id === projectId) || null
      }

      const mutatePhases = updatedProject?.phases.map((phase) => ({ ...phase, is_active: phase.hearings.includes(hearingSlug) }))

      if (mutatePhases) {
        return { ...state, project: { ...updatedProject, phases: mutatePhases } };
      }

      return { ...state, project: updatedProject }
    },
    [EditorActions.CHANGE_PROJECT_NAME]: (state, { payload: { fieldname, value } }) =>
      updeep({
        project: { title: { [fieldname]: value } }
      }, state)
  },
  null,
);

const isFetching = handleActions(
  {
    [combineActions('beginFetchHearing')]: () => true,
    [combineActions('receiveHearing')]: () => false,
    [combineActions('receiveHearingError')]: () => false
  },
  false,
);

const reducer = combineReducers({
  data,
  isFetching,
});


export default reducer;
