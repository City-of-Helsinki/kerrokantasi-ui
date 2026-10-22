import { Button, Dialog } from 'hds-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { hideAlertDialog } from '../actions/alertDialog';

const AlertDialog = () => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const alertDialog = useSelector((state) => state.alertDialog);
  const titleId = 'alert-dialog-title';
  const descriptionId = 'alert-dialog-description';

  if (!alertDialog) {
    return null;
  }

  const close = () => dispatch(hideAlertDialog());

  return (
    <Dialog
      id='alert-dialog'
      isOpen
      close={close}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      closeButtonLabelText={intl.formatMessage({ id: 'close' })}
    >
      <Dialog.Header
        id={titleId}
        title={<FormattedMessage id='alertDialogTitle' />}
      />
      <Dialog.Content>
        <p id={descriptionId}>
          <FormattedMessage id={alertDialog.messageId} />
        </p>
      </Dialog.Content>
      <Dialog.ActionButtons>
        <Button className='kerrokantasi-btn' onClick={close}>
          <FormattedMessage id='close' />
        </Button>
      </Dialog.ActionButtons>
    </Dialog>
  );
};

export default AlertDialog;
