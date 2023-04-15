import { Client } from 'paho-mqtt';
import { getMqttOptions } from './options';
import { MqttOptions } from '../types';
const MqttOptions = getMqttOptions();

let client = new Client(
  MqttOptions.host,
  MqttOptions.port,
  MqttOptions.clientId,
);

export const getClient = () => client;
export const createClient = (
  options: MqttOptions = {
    host: MqttOptions.host,
    port: MqttOptions.port,
    clientId: MqttOptions.clientId,
  },
) => {
  client = new Client(
    (MqttOptions.host = options.host),
    (MqttOptions.port = options.port),
    (MqttOptions.clientId = options.clientId),
  );
  return client;
};
