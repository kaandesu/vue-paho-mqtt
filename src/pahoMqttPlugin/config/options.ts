import { reactive } from 'vue';
import { MqttOptions, PahoMqttPluginOptions } from '../types';
import { defaultMqttOptions, defaultPluginOptions } from './constants';

let PluginOptions = defaultPluginOptions;
export const setPluginOptions = (options: Partial<PahoMqttPluginOptions>) => {
  PluginOptions = { ...PluginOptions, ...options };
  return PluginOptions;
};
export const getPluginOptions = () => PluginOptions;

let MqttOptionsLocal = reactive(defaultMqttOptions);
export const setMqttOptions = (options: Partial<MqttOptions>) => {
  MqttOptionsLocal = reactive({ ...MqttOptionsLocal, ...options });
  return MqttOptionsLocal;
};
export const getMqttOptions = () => MqttOptionsLocal;
