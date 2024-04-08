import type { Qos } from 'paho-mqtt';
export * from './../index';

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

export type MqttState = Record<MqttMode, { qos: Qos; ret: boolean }>;

export type MsgHandler = Record<string, ((payload: string) => unknown)[]>;

export interface MqttOptions {
  host: string;
  port: number;
  path?: string;
  clientId: string;
  useSSL?: boolean;
  mainTopic?: string;
  enableMainTopic?: boolean;
  watchdogTimeout?: number;
  reconnectTimeout?: number;
  username?: string;
  password?: string;
}
