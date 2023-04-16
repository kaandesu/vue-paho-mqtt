import { defaultMqttOptions, defaultPluginOptions } from '~/config/constants';
import {
  getMqttOptions,
  getPluginOptions,
  setMqttOptions,
  setPluginOptions,
} from '~/config/options';
import { MqttOptions, PahoMqttPluginOptions } from '~/types/types';

describe('options', () => {
  const mockMqttOptions: MqttOptions = {
    host: `${defaultMqttOptions.host}-testing}`,
    port: 9999 - defaultMqttOptions.port,
    clientId: `${defaultMqttOptions.clientId}-testing}`,
  };

  const mockPluginOptions: PahoMqttPluginOptions = {
    autoConnect: !defaultPluginOptions.autoConnect,
    showNotifications: !defaultPluginOptions.showNotifications,
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
    expect(PluginOptions.autoConnect).toEqual(mockPluginOptions.autoConnect);
    expect(PluginOptions.showNotifications).toEqual(
      mockPluginOptions.showNotifications,
    );
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
