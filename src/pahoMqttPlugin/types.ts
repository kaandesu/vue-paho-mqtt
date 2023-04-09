import type { Qos } from 'paho-mqtt';
export * from './index';
import type { SubscribeFunction } from './utils/subscribe';
import type { PublishFunction } from './utils/publish';
import { ConnectFunction } from './utils/connectClient';
import { DisconnectFunction } from './utils/disconnectClient';
import { UnsubscribeFunction } from './utils/unsubscribe';
import { UnsubscribeAllFunction } from './utils/unsubscribeAll';
import {
  ClientIdFunction,
  HostFunction,
  MainTopicFunction,
  PortFunction,
  StatusFunction,
} from './utils/mqttSettings';

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
  [topic: string]: [((payload: string) => void)?];
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
  connect: ConnectFunction;
  disconnect: DisconnectFunction;
  subscribe: SubscribeFunction;
  publish: PublishFunction;
  host: HostFunction;
  port: PortFunction;
  clientId: ClientIdFunction;
  mainTopic: MainTopicFunction;
  unsubscribe: UnsubscribeFunction;
  unsubscribeAll: UnsubscribeAllFunction;
  status: StatusFunction;
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $mqtt: MqttInstance;
  }
}
