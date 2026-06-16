import { combineReducers, createReducer } from '@reduxjs/toolkit';
import { head, findIndex } from 'lodash';

import {
  moveSubsectionInArray,
  initNewPhase,
  initNewProject,
} from '../../utils/hearingEditor';
import { EditorActions } from '../../actions/hearingEditor';

export const INIT_NEW_PROJECT_ID = 'pleaseinitnewprojectforme';
export const NO_PROJECT_ID = 'noProject';

const sectionMoveUp = (sections, sectionId) => {
  const sectionIndex = findIndex(sections, (el) => el === sectionId);
  return moveSubsectionInArray(sections, sectionIndex, -1);
};

const sectionMoveDown = (sections, sectionId) => {
  const sectionIndex = findIndex(sections, (el) => el === sectionId);
  return moveSubsectionInArray(sections, sectionIndex, 1);
};

const data = createReducer(null, (builder) => {
  builder
    .addCase(
      EditorActions.EDIT_HEARING,
      (state, { payload: { field, value } }) => ({
        ...state,
        [field]: value,
      })
    )
    .addCase(
      EditorActions.CREATE_MAP_MARKER,
      (state, { payload: { value } }) => ({
        ...state,
        geojson: value.geometry,
      })
    )
    .addCase(EditorActions.ADD_MAP_MARKER, (state, { payload: { value } }) => {
      const foo = state.geojson;

      return {
        ...state,
        geojson: {
          type: 'FeatureCollection',
          features: [{ type: 'Feature', geometry: foo }, { ...value }],
        },
      };
    })
    .addCase(
      EditorActions.ADD_MAP_MARKER_TO_COLLECTION,
      (state, { payload: { value } }) => ({
        ...state,
        geojson: {
          ...state.geojson,
          features: [...state.geojson.features, { ...value }],
        },
      })
    )
    .addCase(EditorActions.ADD_SECTION, (state, { payload: { section } }) => ({
      ...state,
      sections: [...state.sections, section.frontId],
    }))
    .addCase(
      EditorActions.REMOVE_SECTION,
      (state, { payload: { sectionID } }) => ({
        ...state,
        sections: state.sections.filter((id) => id !== sectionID),
      })
    )
    .addCase(
      EditorActions.UPDATE_HEARING_AFTER_SAVE,
      (state, { payload: { result, entities } }) => ({
        ...state,
        ...entities.hearing[result],
      })
    )
    .addCase(
      EditorActions.ADD_LABEL_SUCCESS,
      (state, { payload: { label } }) => {
        const labels = [...state.labels, label.id];
        return { ...state, labels };
      }
    )
    .addCase(
      EditorActions.SECTION_MOVE_UP,
      (state, { payload: sectionId }) => ({
        ...state,
        sections: sectionMoveUp(state.sections, sectionId),
      })
    )
    .addCase(
      EditorActions.SECTION_MOVE_DOWN,
      (state, { payload: sectionId }) => ({
        ...state,
        sections: sectionMoveDown(state.sections, sectionId),
      })
    )
    .addCase(EditorActions.ADD_PHASE, (state) => ({
      ...state,
      project: {
        ...state.project,
        phases: [...state.project.phases, initNewPhase()],
      },
    }))
    .addCase(EditorActions.DELETE_PHASE, (state, { payload: { phaseId } }) => ({
      ...state,
      project: {
        ...state.project,
        phases: state.project.phases.filter(
          (phase) => phase.id !== phaseId && phase.frontId !== phaseId
        ),
      },
    }))
    .addCase(EditorActions.ACTIVE_PHASE, (state, { payload: { phaseId } }) => ({
      ...state,
      project: {
        ...state.project,
        phases: state.project.phases.map((phase) => ({
          ...phase,
          is_active: phase.id === phaseId || phase.frontId === phaseId,
        })),
      },
    }))
    .addCase(
      EditorActions.EDIT_PHASE,
      (state, { payload: { phaseId, fieldName, language, value } }) => ({
        ...state,
        project: {
          ...state.project,
          phases: state.project.phases.map((phase) => {
            if (phase.id === phaseId || phase.frontId === phaseId) {
              return {
                ...phase,
                [fieldName]: { ...phase[fieldName], [language]: value },
              };
            }
            return phase;
          }),
        },
      })
    )
    .addCase(
      EditorActions.CHANGE_PROJECT,
      (state, { payload: { hearingSlug, projectId, projectLists } }) => {
        let updatedProject;
        if (projectId === NO_PROJECT_ID) {
          return { ...state, project: null };
        } else if (projectId === INIT_NEW_PROJECT_ID) {
          updatedProject = initNewProject();
        } else {
          updatedProject =
            projectLists.find((project) => project.id === projectId) || null;
        }

        const mutatePhases = updatedProject?.phases.map((phase) => ({
          ...phase,
          is_active: phase.hearings.includes(hearingSlug),
        }));

        if (mutatePhases) {
          return {
            ...state,
            project: { ...updatedProject, phases: mutatePhases },
          };
        }

        return { ...state, project: updatedProject };
      }
    )
    .addCase(
      EditorActions.CHANGE_PROJECT_NAME,
      (state, { payload: { fieldname, value } }) => ({
        ...state,
        project: {
          ...state.project,
          title: { ...state.project.title, [fieldname]: value },
        },
      })
    )
    .addCase(
      EditorActions.RECEIVE_HEARING,
      (_state, { payload: { result, entities } }) => entities.hearing[result]
    )
    .addCase(
      EditorActions.INIT_NEW_HEARING,
      // Weird way of getting the normalized hearing when the hearing actually was normalized without any identifier
      (_state, { payload: { entities } }) =>
        entities.hearing[head(Object.keys(entities.hearing))]
    );
});

const isFetching = createReducer(false, (builder) => {
  builder
    .addCase('beginFetchHearing', () => true)
    .addCase('receiveHearing', () => false)
    .addCase('receiveHearingError', () => false);
});

const reducer = combineReducers({
  data,
  isFetching,
});

export default reducer;
