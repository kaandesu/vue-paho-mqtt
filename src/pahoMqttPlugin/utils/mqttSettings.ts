import { getMqttOptions } from '~/config/options';
import { mqttStatus } from './refs';

export const host = (e?: string) => {
  const MqttOptions = getMqttOptions();
  if (e !== undefined) {
    return (MqttOptions.host = e);
  }
  return MqttOptions.host;
};

export const port = (e?: number) => {
  const MqttOptions = getMqttOptions();
  if (e !== undefined) {
    return (MqttOptions.port = e);
  }
  return MqttOptions.port;
};

export const clientId = (e?: string) => {
  const MqttOptions = getMqttOptions();
  if (e !== undefined) {
    return (MqttOptions.clientId = e);
  }
  return MqttOptions.clientId;
};

export const mainTopic = (e?: string) => {
  const MqttOptions = getMqttOptions();
  if (e !== undefined) {
    return (MqttOptions.mainTopic = e);
  }
  return MqttOptions.mainTopic;
};

export const status = () => {
  return mqttStatus.value;
};
