import { getClient } from '~/config/client';
import { SweetAlert } from '~/utils/SweetAlert';
import {
  clearQueueMsgHandlers,
  msgHandlers,
  queueMsgHandlers,
} from '~/utils/msgHandlers';
import { connectWatchdog, mqttStatus, stayConnected } from '~/utils/refs';

export const onConnectCallback = (): void => {
  clearTimeout(connectWatchdog.value as NodeJS.Timeout);
  const client = getClient();
  mqttStatus.value = 'connected';
  stayConnected.value = true;
  console.log('%cmqtt connected', 'color:green');

  for (const topic of Object.keys(queueMsgHandlers)) {
    if (!msgHandlers[topic]) {
      msgHandlers[topic] = [];
    }

    client.subscribe(topic);

    for (const handler of queueMsgHandlers[topic]) {
      msgHandlers[topic].push(handler);
    }
  }

  clearQueueMsgHandlers();

  SweetAlert({
    title: 'Connected',
    text: 'Mqtt Connected',
    icon: 'success',
    timer: 1500,
    timerProgressBar: true,
  });
};
