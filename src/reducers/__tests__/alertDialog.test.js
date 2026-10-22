import { hideAlertDialog, showAlertDialog } from '../../actions/alertDialog';
import alertDialog from '../alertDialog';

describe('alertDialog', () => {
  it('is closed initially', () => {
    expect(alertDialog(undefined, { type: '@@INIT' })).toBeNull();
  });

  it('opens with the message to show', () => {
    expect(alertDialog(null, showAlertDialog('commentReceived'))).toEqual({
      messageId: 'commentReceived',
    });
  });

  it('replaces an open message with a newer one', () => {
    const state = alertDialog(null, showAlertDialog('commentReceived'));

    expect(alertDialog(state, showAlertDialog('commentEdited'))).toEqual({
      messageId: 'commentEdited',
    });
  });

  it('closes', () => {
    const state = alertDialog(null, showAlertDialog('commentReceived'));

    expect(alertDialog(state, hideAlertDialog())).toBeNull();
  });
});
