import { Client } from 'paho-mqtt';
import { getMqttOptions, setMqttOptions } from './options';
import { MqttOptions } from '../types';
const mqttOptions = getMqttOptions();

let client = new Client(
  mqttOptions.host,
  mqttOptions.port,
  mqttOptions.clientId,
);

export const getClient = () => client;
export const createClient = (options?: MqttOptions) => {
  if (options !== undefined) setMqttOptions(options);
  let mqttOptions = getMqttOptions();
  client = new Client(mqttOptions.host, mqttOptions.port, mqttOptions.clientId);
  return client;
};
