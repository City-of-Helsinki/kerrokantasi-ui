import reducer from '..';
import { EditorActions } from '../../../actions/hearingEditor';

const uploadingImages = (actions) =>
  actions.reduce((state, type) => reducer(state, { type }), undefined)
    .editorState.uploadingImages;

describe('hearingEditor reducer: uploadingImages', () => {
  it('counts image uploads in progress', () => {
    expect(
      uploadingImages([
        EditorActions.IMAGE_UPLOAD_STARTED,
        EditorActions.IMAGE_UPLOAD_STARTED,
        EditorActions.IMAGE_UPLOAD_FINISHED,
      ])
    ).toBe(1);
  });

  it('never goes below zero', () => {
    expect(uploadingImages([EditorActions.IMAGE_UPLOAD_FINISHED])).toBe(0);
  });

  it('keeps counting an upload that finishes after the editor was closed', () => {
    expect(
      uploadingImages([
        EditorActions.IMAGE_UPLOAD_STARTED,
        EditorActions.CLOSE_FORM,
        EditorActions.SHOW_FORM,
        EditorActions.IMAGE_UPLOAD_STARTED,
        EditorActions.IMAGE_UPLOAD_FINISHED,
      ])
    ).toBe(1);
  });
});
