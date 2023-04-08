import { getClient } from '../config/client';
import { getMqttOptions } from '../config/options';
import { msgHandlers, queueMsgHandlers } from './msgHandlers';

export const unsubscribe = (topic: string, useMainTopic = true) => {
  const MqttOptions = getMqttOptions();
  const client = getClient();

  topic =
    useMainTopic && MqttOptions.enableMainTopic
      ? `${MqttOptions.mainTopic}/${topic}`
      : topic;
  if (msgHandlers[topic]) delete msgHandlers[topic];
  if (queueMsgHandlers[topic]) delete queueMsgHandlers[topic];
  if (client && client.isConnected()) {
    client.unsubscribe(topic);
  }
};
