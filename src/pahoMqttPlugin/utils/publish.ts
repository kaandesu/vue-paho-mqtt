import { getClient } from '~/config/client';
import { MQTT_STATE } from '~/config/constants';
import { getMqttOptions } from '~/config/options';
import { MqttMode } from '~/types/types';

/**
 * @description used to publish string data to the topic specified
 * @param topic mqtt topic
 * @param payload payload to be sent
 * @param mode  "B" - for best effort (at most once delivery)
 *              "F" - for at least once delivery
 * @param useMainTopic if true, MqttOptions.mainTopic will be prepended to the topic (default: true)
 * @throws {Error} if the client is not connected
 */
export const publish = (
  topic: string,
  payload: string,
  mode: MqttMode,
  useMainTopic = true,
) => {
  const MqttOptions = getMqttOptions();
  const client = getClient();

  topic =
    useMainTopic && MqttOptions.enableMainTopic
      ? `${MqttOptions.mainTopic}/${topic}`
      : topic;
  if (client && client.isConnected()) {
    try {
      client.send(topic, payload, MQTT_STATE[mode].qos, MQTT_STATE[mode].ret);
    } catch (err: unknown) {
      if (err instanceof Error) throw new Error(err.message);
    }
  }
};
