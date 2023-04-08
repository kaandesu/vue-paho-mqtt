import { SweetAlert } from './SweetAlert';
import { disconnectClient } from './disconnectClient';
import { connectWatchdog, mqttStatus } from './refs';
import { getMqttOptions } from '../config/options';
import { onFailureCallback } from '../functions/onFailure';
import { onConnectCallback } from '../functions/onConnect';
import { onMessageArrivedCallback } from '../functions/onMessageArrived';
import { onConnectionLostCallback } from '../functions/onConnectionLost';
import { createClient } from '../config/client';

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
  }) => unknown;
} = {}) => {
  const MqttOptions = getMqttOptions();
  mqttStatus.value = 'connecting';

  connectWatchdog.value = setTimeout(() => {
    mqttStatus.value = 'error';
    disconnectClient();
    SweetAlert({
      title: 'Mqtt Error',
      text: 'Broker connection timed out!',
      icon: 'error',
    });
  }, MqttOptions.watchdogTimeout);

  try {
    const client = createClient({
      host: MqttOptions.host,
      port: MqttOptions.port,
      clientId: MqttOptions.clientId,
    });

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

    client.connect({
      onSuccess: () => {
        onConnectCallback();
        if (onConnect) onConnect();
      },
      onFailure: () => {
        onFailureCallback();
        if (onFailure) onFailure();
      },
    });
  } catch (err: unknown) {
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
};
