import axios from 'axios';
import getEnvVars from '../../config';

const { apiUrl } = getEnvVars();

export interface NotificationSetting {
  id: string;
  isEnabled: boolean;
}

export const updateNotificationSetting = async (id: string, isEnabled: boolean): Promise<NotificationSetting> => {
  try {
    const response = await axios.put(`${apiUrl}/app/user/notification-settings/${id}`, { isEnabled });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar configuración de notificación:', error);
    throw error;
  }
};