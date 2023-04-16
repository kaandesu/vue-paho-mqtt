import { getClient } from '~/config/client';
import { getMqttOptions } from '~/config/options';
import { msgHandlers, queueMsgHandlers } from './msgHandlers';

/**
 * Unsubscribe from a topic
 * @param topic The topic to unsubscribe from
 * @param useMainTopic if true, MqttOptions.mainTopic will be prepended to the topic (default: true)
 * @returns {void}
 */
export const unsubscribe = (topic: string, useMainTopic = true): void => {
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
