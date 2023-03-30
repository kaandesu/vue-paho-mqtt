import type { Qos } from "paho-mqtt";
export interface PahoMqttPluginOptions {
  showNotifications?: boolean;
  autoConnect?: boolean;
}
export interface MainOptions {
  PluginOptions: PahoMqttPluginOptions;
  MqttOptions: MqttOptions;
}

export type MqttMode = "B" | "F";

export interface MqttState {
  [key: string]: {
    qos: Qos;
    ret: boolean;
  };
}
export interface MsgHandler {
  [topic: string]: [((fnc: any) => any)?];
}

export interface MqttOptions {
  host: string;
  port: number;
  clientId: string;
  mainTopic?: string;
}
