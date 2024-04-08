import { Client } from 'paho-mqtt';
import { MqttOptions } from '~/types/types';
import { getMqttOptions } from './options';
const mqttOptions = getMqttOptions();

let client = new Client(
  mqttOptions.host,
  mqttOptions.port,
  mqttOptions.clientId,
);

export const getClient = (): Client => client;
export const createClient = (
  options: MqttOptions = {
    host: getMqttOptions().host,
    port: getMqttOptions().port,
    path: getMqttOptions().path,
    clientId: getMqttOptions().clientId,
    username: getMqttOptions().username,
    password: getMqttOptions().password,
    useSSL: getMqttOptions().useSSL,
  },
): Client => {
  mqttOptions.username = options.username;
  mqttOptions.password = options.password;
  mqttOptions.useSSL = options.useSSL;

  client = new Client(
    (mqttOptions.host = options.host),
    (mqttOptions.port = options.port),
    (mqttOptions.clientId = options.clientId),
  );
  return client;
};
