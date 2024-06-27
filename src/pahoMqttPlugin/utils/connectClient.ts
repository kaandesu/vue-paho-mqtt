import { createClient } from '~/config/client';
import { getMqttOptions } from '~/config/options';
import { defaultMqttOptions } from '~/config/constants';
import { onConnectCallback } from '~/functions/onConnect';
import { onConnectionLostCallback } from '~/functions/onConnectionLost';
import { onFailureCallback } from '~/functions/onFailure';
import { onMessageArrivedCallback } from '~/functions/onMessageArrived';
import { SweetAlert } from './SweetAlert';
import { disconnectClient } from './disconnectClient';
import { mqttStatus } from './refs';

/**
 * Connect to the mqtt broker
 * Shows a dialog notification in case of error if the plugin is configured to do so.
 * @param {object} [options={}] - options object
 * @param {function} [options.onConnect] - function to be called when the client connects to the broker
 * @param {function} [options.onFailure] - function to be called when the client fails to connect to the broker
 * @param {function} [options.onConnectionLost] - function to be called when the client loses connection to the broker
 * @param {function} [options.onMessageArrived] - function to be called when a message is received
 * @returns {Promise<boolean>} - returns true if the client connects to the broker
 */
export const connectClient = ({
  onConnect,
  onFailure,
  onConnectionLost,
  onMessageArrived,
}: {
  onConnect?: (...args: unknown[]) => unknown;
  onFailure?: (...args: unknown[]) => unknown;
  onConnectionLost?: (
    responseObject: { errorCode: number },
    ...args: unknown[]
  ) => unknown;
  onMessageArrived?: (
    message: {
      payloadString: string;
      destinationName: string;
    },
    ...args: unknown[]
  ) => unknown;
} = {}): Promise<boolean> => {
  const MqttOptions = getMqttOptions();

  if (mqttStatus.value === 'connected') disconnectClient();

  mqttStatus.value = 'connecting';

  const client = createClient();

  client.onConnectionLost = (responseObject: { errorCode: number }) => {
    onConnectionLostCallback(responseObject);
    if (onConnectionLost) onConnectionLost(responseObject);
  };

  client.onMessageArrived = (message: {
    payloadString: string;
    destinationName: string;
  }) => {
    onMessageArrivedCallback(message);
    if (onMessageArrived) onMessageArrived(message);
  };
  return new Promise((resolve, reject) => {
    try {
      client.connect({
        userName: MqttOptions.username,
        password: MqttOptions.password,
        useSSL: MqttOptions.useSSL,
        timeout:
          (MqttOptions.watchdogTimeout || defaultMqttOptions.watchdogTimeout!) /
          1000,
        keepAliveInterval:
          (MqttOptions.keepAliveInterval ||
            defaultMqttOptions.keepAliveInterval!) / 1000,
        cleanSession: MqttOptions.cleanSession,
        uris:
          MqttOptions.useSSL === false
            ? [
                `ws://${MqttOptions.host}:${MqttOptions.port}${MqttOptions.path}`,
              ]
            : [
                `wss://${MqttOptions.host}:${MqttOptions.port}${MqttOptions.path}`,
                `ws://${MqttOptions.host}:${MqttOptions.port}${MqttOptions.path}`,
              ],
        onSuccess: () => {
          resolve(true);
          onConnectCallback();
          if (onConnect) onConnect();
        },
        onFailure: async () => {
          reject();
          await onFailureCallback();
          if (onFailure) onFailure();
        },
      });
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
