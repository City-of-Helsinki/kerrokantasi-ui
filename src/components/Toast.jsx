import { Notification } from "hds-react";
import { isEmpty } from "lodash";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { removeToast } from "../actions/toast";

const Toast = () => {
    const dispatch = useDispatch();
    const notifications = useSelector((state) => state.toast);

    const handleClose = (notification) => {
        dispatch(removeToast(notification));
    }

    return (
        <div className="toast-container">
            {!isEmpty(notifications) && notifications.map((notification) => (
                    <Notification
                        key={notification.id}
                        label={notification.label}
                        type={notification.type}
                        onClose={() => handleClose(notification)}
                        dismissible
                    >
                        {notification.message}
                    </Notification>
                ))}
        </div>
    )
}
export default Toast;