import { getMqttOptions } from '../config/options';
import { MqttStatus } from '../types';
import { mqttStatus } from './refs';

export type PortFunction = typeof port;

export const port = (e?: number) => {
  const MqttOptions = getMqttOptions();
  if (e !== undefined) {
    return (MqttOptions.port = e);
  }
  return MqttOptions.port;
};

export type HostFunction = typeof host;

export const host = (e?: string) => {
  const MqttOptions = getMqttOptions();
  if (e !== undefined) {
    return (MqttOptions.host = e);
  }
  return MqttOptions.host;
};

export type ClientIdFunction = typeof clientId;

export const clientId = (e?: string) => {
  const MqttOptions = getMqttOptions();
  if (e !== undefined) {
    return (MqttOptions.clientId = e);
  }
  return MqttOptions.clientId;
};

export type MainTopicFunction = typeof mainTopic;

export const mainTopic = (e?: string) => {
  const MqttOptions = getMqttOptions();
  if (e !== undefined) {
    return (MqttOptions.mainTopic = e);
  }
  return MqttOptions.mainTopic;
};

export type StatusFunction = typeof status;

export const status = (e?: MqttStatus | string) => {
  if (e !== undefined && e !== null) {
    return (mqttStatus.value = e);
  }
  return mqttStatus.value;
};
