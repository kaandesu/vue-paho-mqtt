import { SweetAlert } from './SweetAlert';
import { disconnectClient } from './disconnectClient';
import { connectWatchdog, mqttStatus, stayConnected } from './refs';
import { getMqttOptions } from '../config/options';
import { onFailureCallback } from '../functions/onFailure';
import { onConnectCallback } from '../functions/onConnect';
import { onMessageArrivedCallback } from '../functions/onMessageArrived';
import { onConnectionLostCallback } from '../functions/onConnectionLost';
import { createClient } from '../config/client';

export type ConnectFunction = typeof connectClient;

/**
 * Connect to the mqtt broker
 * Shows a dialog notification in case of error if the plugin is configured to do so.
 */
export const connectClient = ({
  onConnect,
  onFailure,
  onConnectionLost,
  onMessageArrived,
}: {
  onConnect?: () => unknown;
  onFailure?: () => unknown;
  onConnectionLost?: (responseObject: { errorCode: number }) => unknown;
  onMessageArrived?: (message: {
    payloadString: string;
    destinationName: string;
  }) => void;
} = {}) => {
  const MqttOptions = getMqttOptions();

  if (mqttStatus.value === 'connected') disconnectClient();

  mqttStatus.value = 'connecting';
  connectWatchdog.value = setTimeout(async () => {
    mqttStatus.value = 'error';
    await disconnectClient();
    SweetAlert({
      title: 'Mqtt Error',
      text: 'Broker connection timed out!',
      icon: 'error',
    });
  }, MqttOptions.watchdogTimeout);

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
        onSuccess: () => {
          resolve(true);
          onConnectCallback();
          if (onConnect) onConnect();
        },
        onFailure: () => {
          reject();
          onFailureCallback();
          if (onFailure) onFailure();
        },
        uris: [
          `ws://${MqttOptions.host}:${MqttOptions.port}`,
          `wss://${MqttOptions.host}:${MqttOptions.port}`,
        ],
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

      clearTimeout(connectWatchdog.value as NodeJS.Timeout);
    }
  });
};
