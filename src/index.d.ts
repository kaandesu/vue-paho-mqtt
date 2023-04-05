import { MqttInstance } from './pahoMqttPlugin/types';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $mqtt: MqttInstance;
    $showClient: () => void;
  }
}

export {};
