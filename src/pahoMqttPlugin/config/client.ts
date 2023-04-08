import { Client } from 'paho-mqtt';
import { getMqttOptions } from './options';

const MqttOptions = getMqttOptions();

let client = new Client(
  MqttOptions.host,
  MqttOptions.port,
  MqttOptions.clientId,
);

export const getClient = () => client;
export const createClient = ({
  host = MqttOptions.host,
  port = MqttOptions.port,
  clientId = MqttOptions.clientId,
}) => {
  client = new Client(host, port, clientId);
  return client;
};
