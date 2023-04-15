import { MqttOptions, MqttState, PahoMqttPluginOptions } from '../types';

export const MQTT_STATE: MqttState = {
  B: {
    qos: 0,
    ret: false,
  },
  Br: {
    qos: 0,
    ret: true,
  },
  Q: {
    qos: 1,
    ret: false,
  },
  Qr: {
    qos: 1,
    ret: true,
  },
  F: {
    qos: 2,
    ret: true,
  },
  Fnr: {
    qos: 2,
    ret: false,
  },
};

export const defaultPluginOptions: PahoMqttPluginOptions = {
  showNotifications: true,
  autoConnect: true,
};

export const defaultMqttOptions: MqttOptions = {
  host: 'localhost',
  port: 9001,
  clientId: `ClientId-${Math.random() * 9999}`,
  mainTopic: 'vue-paho-mqtt-test',
  enableMainTopic: true,
  watchdogTimeout: 2000,
  reconnectTimeout: 5000,
};
