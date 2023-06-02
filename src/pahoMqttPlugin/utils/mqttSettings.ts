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

export const useSSL = (e?: boolean) => {
  const MqttOptions = getMqttOptions();
  if (e !== undefined) {
    return (MqttOptions.useSSL = e);
  }
  return MqttOptions.useSSL;
};

export const username = (e?: string) => {
  const MqttOptions = getMqttOptions();
  if (e !== undefined) {
    return (MqttOptions.username = e);
  }
  return MqttOptions.username;
};

export const password = (e?: string) => {
  const MqttOptions = getMqttOptions();
  if (e !== undefined) {
    return (MqttOptions.password = e);
  }
  return MqttOptions.password;
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
