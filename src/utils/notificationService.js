import { get } from "../api";

function mapNotifications(notifications, language) {
    return notifications.map(notification => ({
            id: notification.id,
            content: notification.content[language],
            title: notification.title[language],
            level: notification.type_name.toLowerCase(),
            modified_at: notification.modified_at,
            external_url: notification.external_url[language],
            external_url_title: notification.external_url_title[language],
        }));
}

export async function getNotifications(lang) {
    return get("/v1/notifications").then(async response => {
        const data = await response.json();
        return mapNotifications(data, lang);
    });
}

export default getNotifications;
