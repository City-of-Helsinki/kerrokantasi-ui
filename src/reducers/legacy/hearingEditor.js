import {handleActions} from 'redux-actions';
import updeep from 'updeep';
import {
  assign,
  cloneDeep,
  findIndex,
} from 'lodash';

import {initNewHearing, getOrCreateSectionByID} from '../../utils/hearing';
import {getMainImage} from '../../utils/section';


const beginEditHearing = (state, action) => {
  return assign({}, state, {
    // Make a deep clone out of the existing hearing
    // so that we can modify the clone.
    hearing: cloneDeep(action.payload.hearing),
  });
};


const beginCreateHearing = (state) => {
  return assign({}, state, {
    hearing: initNewHearing(),
    languages: ['fi']
  });
};


const receiveHearingEditorMetaData = (state, action) => {
  return assign(    // The new state shall be...
    {},             // an empty object,
    state,          // shallowly updated with the current state,
    {               // and then by the received keys.
      metaData: action.payload
    }
  );
};


const changeHearing = (state, action) => {
  return assign({}, state, {
    hearing: {...state.hearing, [action.payload.field]: action.payload.value}
  });
};


const changeSection = (state, {payload}) => {
  const hearing = cloneDeep(state.hearing);
  const {sectionID, field, value} = payload;
  const section = getOrCreateSectionByID(hearing, sectionID);
  section[field] = value;
  return assign({}, state, {hearing});
};


const changeSectionMainImage = (state, {payload}) => {
  const hearing = cloneDeep(state.hearing);
  const {sectionID, field, value} = payload;
  const section = getOrCreateSectionByID(hearing, sectionID);
  const image = getMainImage(section);
  if (section.images.length <= 0) {
    section.images.push(image);
  }
  image[field] = value;
  if (field === "image") {
    // Only one of the two fields should have valid reference to an image.
    image.url = "";
  }
  return assign({}, state, {hearing});
};


const addSection = (state, {payload}) => {
  const hearing = cloneDeep(state.hearing);
  hearing.sections.push(payload.section);
  return assign({}, state, {hearing});
};


const removeSection = (state, {payload}) => {
  const hearing = cloneDeep(state.hearing);
  const sectionID = payload.sectionID;
  const index = findIndex(hearing.sections, (section) => {
    if (section.id) {
      return section.id === sectionID;
    }
    return section.frontID === sectionID;
  });
  if (index >= 0) {
    hearing.sections.splice(index, 1);
  }
  return assign({}, state, {hearing});
};


const showHearingForm = (state) => {
  return assign({}, state, {
    editorState: "editForm",
  });
};


const closeHearingForm = (state) => {
  return assign({}, state, {
    editorState: "preview",
  });
};


const savedHearing = (state, {payload}) => {
  return updeep({
    editorState: "preview",
    errors: null,
    hearing: updeep({isNew: false}, payload.hearing),
  }, state);
};


const saveHearingFailed = (state, action) => {
  return assign({}, state, {
    errors: action.payload.errors
  });
};


export default handleActions({
  addSection,
  beginCreateHearing,
  beginEditHearing,
  changeHearing,
  changeSection,
  changeSectionMainImage,
  closeHearingForm,
  receiveHearingEditorMetaData,
  removeSection,
  savedHearingChange: savedHearing,
  savedNewHearing: savedHearing,
  saveHearingFailed,
  showHearingForm,
}, {});
