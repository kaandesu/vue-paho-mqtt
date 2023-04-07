import type { Qos } from 'paho-mqtt';
export * from './index';
export interface PahoMqttPluginOptions {
  showNotifications?: boolean;
  autoConnect?: boolean;
}
export interface MainOptions {
  PluginOptions: PahoMqttPluginOptions;
  MqttOptions: MqttOptions;
}

export type MqttMode = 'B' | 'F' | 'Q' | 'Qr' | 'Br' | 'Fnr';

export type MqttStatus =
  | 'connected'
  | 'disconnected'
  | 'connecting'
  | 'error'
  | 'lost'
  | null;
export interface MqttState {
  [key: string]: {
    qos: Qos;
    ret: boolean;
  };
}
export interface MsgHandler {
  [topic: string]: [((payload: unknown) => unknown)?];
}

export interface MqttOptions {
  host: string;
  port: number;
  clientId: string;
  mainTopic?: string;
  enableMainTopic?: boolean;
  watchdogTimeout?: number;
  reconnectTimeout?: number;
}

export interface MqttInstance {
  connect: () => void;
  disconnect: () => void;
  subscribe: (
    topic: string,
    onMessage: (data?: any) => void,
    useMainTopic?: boolean,
  ) => void;
  publish: (
    topic: string,
    payload: string,
    mode: MqttMode,
    useMainTopic?: boolean,
  ) => void;
  host: (host?: string) => void;
  port: (port?: number) => void;
  clientId: (clientId?: string) => void;
  mainTopic: (mainTopic?: string) => void;
  unsubscribe: (topic: string, useMainTopic?: boolean) => void;
  unsubscribeAll: () => void;
  status: (status?: MqttStatus | string) => unknown;
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $mqtt: MqttInstance;
  }
}
