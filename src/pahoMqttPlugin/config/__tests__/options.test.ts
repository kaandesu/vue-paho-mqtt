import { describe, expect, it } from 'vitest';
import {
  getMqttOptions,
  getPluginOptions,
  setMqttOptions,
  setPluginOptions,
} from '../options';
import { MqttOptions, PahoMqttPluginOptions } from '../../types';

describe('options', () => {
  const mockMqttOptions: MqttOptions = {
    host: 'testing',
    port: 1337,
    clientId: 'mock',
  };

  const mockPluginOptions: PahoMqttPluginOptions = {
    autoConnect: true,
    showNotifications: true,
  };

  it('should set mqttOptions', () => {
    const MqttOptions = setMqttOptions(mockMqttOptions);

    expect(MqttOptions).toBeDefined();
    expect(MqttOptions.host).toEqual(mockMqttOptions.host);
    expect(MqttOptions.port).toEqual(mockMqttOptions.port);
    expect(MqttOptions.clientId).toEqual(mockMqttOptions.clientId);
  });

  it('should set pluginOptions', () => {
    const PluginOptions = setPluginOptions(mockPluginOptions);

    expect(PluginOptions).toBeDefined();
    expect(PluginOptions.autoConnect).toEqual(true);
    expect(PluginOptions.showNotifications).toEqual(true);
  });

  it('should get mqttOptions', () => {
    const MqttOptions = getMqttOptions();

    expect(MqttOptions).toBeDefined();
    expect(MqttOptions.host).toEqual(mockMqttOptions.host);
    expect(MqttOptions.port).toEqual(mockMqttOptions.port);
    expect(MqttOptions.clientId).toEqual(mockMqttOptions.clientId);
  });

  it('should get pluginOptions', () => {
    const PluginOptions = getPluginOptions();

    expect(PluginOptions).toBeDefined();
    expect(PluginOptions.autoConnect).toBeDefined();
    expect(PluginOptions.showNotifications).toBeDefined();
  });
});
