import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { get } from '../api';

/**
 * Maps API notification data to the format expected by NotificationService
 * 
 * @param {Array} notifications - Raw notification data from API
 * @param {string} language - Current language code
 * @returns {Array} - Formatted notification objects
 */
function mapNotifications(notifications, language) {
  return notifications.map(notification => ({
    id: notification.id,
    content: notification.content[language],
    title: notification.title[language],
    level: notification.type_name.toLowerCase(),
    modified_at: notification.modified_at,
    external_url: notification.external_url[language],
    external_url_text: notification.external_url_title[language],
  }));
}

/**
 * Custom hook to handle notification loading and filtering based on the current route
 * 
 * @param {string} language - The current language for notifications
 * @returns {Object} - The filtered notifications and related metadata
 */
export const useNotifications = (language) => {
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Determine which notification types to show based on the current route
  const visibleTypeRules = useMemo(() => 
    location.pathname !== '/' ? 'error' : 'all', 
  [location.pathname]);

  // Convert visibleTypeRules to an array of notification types
  const visibleTypes = useMemo(() => {
    if (visibleTypeRules === 'all') {
      return ['error', 'alert', 'info'];
    }
    return [visibleTypeRules];
  }, [visibleTypeRules]);

  // Fetch notifications from API
  const fetchNotifications = async (lang) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await get('/v1/notifications');
      const data = await response.json();
      return mapNotifications(data, lang);
    } catch (err) {
      setError(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Load notifications when language changes
  useEffect(() => {
    const loadNotifications = async () => {
      if (!language) return;
      
      const data = await fetchNotifications(language);
      setNotifications(data);
    };
    
    loadNotifications();
  }, [language]);

  return {
    notifications,
    visibleTypes,
    isLoading,
    error
  };
};

export default useNotifications;
