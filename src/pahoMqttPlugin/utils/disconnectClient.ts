import { getClient } from '~/config/client';
import { SweetAlert } from './SweetAlert';
import { mqttStatus, stayConnected } from './refs';

/**
 * @description Disconnect from the mqtt broker.
 * Shows a dialog notification in case of error if the plugin is configured to do so.
 * @returns {Promise<boolean>} - returns true if the client disconnects from the broker
 */
export const disconnectClient = (): Promise<boolean> => {
  stayConnected.value = false;
  const client = getClient();

  return new Promise((resolve, reject) => {
    try {
      client.disconnect();
      resolve(true);
    } catch (err: unknown) {
      reject(err);
      console.error(err);
      mqttStatus.value = 'error';

      if (err instanceof Error)
        SweetAlert({
          title: 'Error',
          text: err.message,
          icon: 'error',
        });
    }
  });
};
