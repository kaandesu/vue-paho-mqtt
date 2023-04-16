import { reactive } from 'vue';
import { MqttOptions, PahoMqttPluginOptions } from '~/types/types';
import { defaultMqttOptions, defaultPluginOptions } from './constants';

let PluginOptions = defaultPluginOptions;
export const setPluginOptions = (
  options: Partial<PahoMqttPluginOptions>,
): PahoMqttPluginOptions => {
  PluginOptions = { ...PluginOptions, ...options };
  return PluginOptions;
};
export const getPluginOptions = (): PahoMqttPluginOptions => PluginOptions;

let MqttOptionsLocal: MqttOptions = reactive(defaultMqttOptions);
export const setMqttOptions = (options: Partial<MqttOptions>): MqttOptions => {
  MqttOptionsLocal = reactive({ ...MqttOptionsLocal, ...options });
  return MqttOptionsLocal;
};
export const getMqttOptions = (): MqttOptions => MqttOptionsLocal;
