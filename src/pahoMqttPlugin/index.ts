import 'sweetalert2/dist/sweetalert2.min.css';
import type { App } from 'vue';
import { setMqttOptions, setPluginOptions } from './config/options';
import { MainOptions } from './types/types';
import {
  connectClient,
  disconnectClient,
  subscribe,
  unsubscribe,
  publish,
  unsubscribeAll,
} from '~/utils';
import {
  host,
  port,
  path,
  useSSL,
  username,
  password,
  clientId,
  mainTopic,
  status,
} from './utils/mqttSettings';

export type MqttInstance = typeof $mqtt;

export const $mqtt = {
  connect: connectClient,
  disconnect: disconnectClient,
  subscribe,
  publish,
  host,
  port,
  path,
  useSSL,
  username,
  password,
  clientId,
  mainTopic,
  unsubscribe,
  unsubscribeAll,
  status,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createPahoMqttPlugin = (MainOptions: MainOptions): any => {
  return (app: App) => {
    const PluginOptions = setPluginOptions(MainOptions.PluginOptions);
    setMqttOptions(MainOptions.MqttOptions);

    /* Check Auto Connect */
    if (PluginOptions.autoConnect) connectClient();

    app.config.globalProperties.$mqtt = $mqtt;
  };
};
