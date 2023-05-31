import 'sweetalert2/dist/sweetalert2.min.css';
import { App } from 'vue';
import { setMqttOptions, setPluginOptions } from './config/options';
import { MainOptions } from './types/types';
import { connectClient } from './utils/connectClient';
import { disconnectClient } from './utils/disconnectClient';
import { subscribe } from './utils/subscribe';
import { unsubscribe } from './utils/unsubscribe';
import { publish } from './utils/publish';
import { unsubscribeAll } from './utils/unsubscribeAll';
import {
  host,
  port,
  clientId,
  mainTopic,
  status,
  username,
  password,
} from './utils/mqttSettings';

export type MqttInstance = typeof $mqtt;

export const $mqtt = {
  connect: connectClient,
  disconnect: disconnectClient,
  subscribe,
  publish,
  host,
  port,
  username,
  password,
  clientId,
  mainTopic,
  unsubscribe,
  unsubscribeAll,
  status,
};

export const createPahoMqttPlugin = (MainOptions: MainOptions) => {
  return (app: App) => {
    const PluginOptions = setPluginOptions(MainOptions.PluginOptions);
    setMqttOptions(MainOptions.MqttOptions);

    /* Check Auto Connect */
    if (PluginOptions.autoConnect) connectClient();

    app.config.globalProperties.$mqtt = $mqtt;
  };
};
