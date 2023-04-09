import { getClient } from '../config/client';
import { getMqttOptions } from '../config/options';
import { msgHandlers, queueMsgHandlers } from './msgHandlers';

export type UnsubscribeFunction = typeof unsubscribe;

/**
 * Unsubscribe from a topic
 * @param topic The topic to unsubscribe from
 * @param useMainTopic If true, the main topic will be prepended to the topic
 * @returns void
 */
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
