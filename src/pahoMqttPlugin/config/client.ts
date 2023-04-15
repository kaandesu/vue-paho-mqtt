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
export const createClient = (
  options: MqttOptions = {
    host: getMqttOptions().host,
    port: getMqttOptions().port,
    clientId: getMqttOptions().clientId,
  },
) => {
  client = new Client(
    (mqttOptions.host = options.host),
    (mqttOptions.port = options.port),
    (mqttOptions.clientId = options.clientId),
  );
  return client;
};
