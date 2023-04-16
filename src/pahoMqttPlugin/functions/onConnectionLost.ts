import { getClient } from '~/config/client';
import { getMqttOptions } from '~/config/options';
import { SweetAlert } from '~/utils/SweetAlert';
import { connectClient } from '~/utils/connectClient';
import {
  clearMsgHandlers,
  msgHandlers,
  queueMsgHandlers,
} from '~/utils/msgHandlers';
import { mqttStatus, stayConnected } from '~/utils/refs';

/**
 * @description fires when the mqtt connection is lost
 * @param responseObject contains the error code of the disconnection
 */
export const onConnectionLostCallback = (responseObject: {
  errorCode: number;
}): void => {
  const client = getClient();
  mqttStatus.value = 'disconnected';
  for (const topic of Object.keys(msgHandlers)) {
    if (!queueMsgHandlers[topic]) {
      queueMsgHandlers[topic] = [];
    }

    for (const handler of msgHandlers[topic]) {
      queueMsgHandlers[topic].push(handler);
    }
  }

  clearMsgHandlers();

  if (responseObject.errorCode !== 0) {
    SweetAlert({
      title: 'Error',
      text: 'MQTT connection lost',
      icon: 'error',
    });
  }
  console.log('%cmqtt disconnected', 'color:red;');
  if (stayConnected.value) {
    console.warn('%cmqtt connection lost', 'color:red;');
    setTimeout(async () => {
      if (!client || !client.isConnected()) {
        await connectClient();
        console.timeEnd('reconnecting...');
      }
    }, getMqttOptions().reconnectTimeout);
  }
};
