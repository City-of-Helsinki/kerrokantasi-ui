import api from "../api";

export async function getNotifications(lang) {
    return api.get("/v1/notifications").then(async response => {
        const data = await response.json();
        const notifications = mapNotifications(data, lang);
        return notifications;
    });
}

function mapNotifications(notifications, language) {
    return notifications.map(notification => {
        return {
            id: notification.id,
            content: notification[`content_${language}`],
            title: notification[`title_${language}`],
            level: notification.type_name.toLowerCase(),
            modified_at: notification.modified_at,
            external_url: notification[`external_url_${language}`],
            external_url_title: notification[`external_url_title_${language}`],
        };
    });
}