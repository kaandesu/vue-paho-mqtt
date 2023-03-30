import {
  PahoMqttPluginOptions,
  MqttOptions,
  MqttState,
  MqttMode,
  MainOptions,
} from "./types";
import type { App } from "vue";
import type { SweetAlertOptions } from "sweetalert2";
import Paho from "paho-mqtt";
import defu from "defu";
import swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { msgHandlers } from "./msgHandlers";

export const createPahoMqttPlugin = (MainOptions: MainOptions) => {
  return (app: App) => {
    // Options
    let { PluginOptions, MqttOptions } = MainOptions;

    PluginOptions = defu(PluginOptions, {
      showNotifications: true,
      autoConnect: true,
    } as PahoMqttPluginOptions);

    MqttOptions = defu(MqttOptions, {
      host: "localhost",
      port: 9001,
      clientId: `ClientID-${Math.random() * 9999}}`,
      mainTopic: "MAIN/",
    } as MqttOptions);

    const MQTT_STATE: MqttState = {
      B: {
        qos: 0,
        ret: false,
      },
      F: {
        qos: 2,
        ret: true,
      },
    };
    // Private Functions
    const SwalFire = (
      swalSettings: SweetAlertOptions,
      enable: boolean = true
    ) => {
      if (!PluginOptions.showNotifications || !enable) return;
      swal.fire(swalSettings);
    };
    const onConnect = () => {
      console.log(
        `%c mqtt connected`,
        "color:green;font-weight:bold;font-size:15px"
      );
      SwalFire({
        title: "Connected",
        text: "Mqtt Connected",
        icon: "success",
        timer: 1500,
        timerProgressBar: true,
      });
    };

    // dissconnect from mqtt
    const disconnectClient = () => {
      try {
        client.disconnect();
        console.log(
          `%c mqtt disconnected`,
          "color:red;font-weight:bold;font-size:15px"
        );
      } catch (err: any) {
        console.error(err);
        SwalFire({ title: "Error", text: err.message, icon: "error" });
      }
    };
    // connect to mqtt
    const connectClient = () => {
      try {
        client.connect({ onSuccess: onConnect });
      } catch (err: any) {
        console.error(err);
        SwalFire({ title: "Error", text: err.message, icon: "error" });
      }
    };
    // mqtt subscribe
    const subscribe = (
      topic: string,
      onMessage: () => any,
      useMainTopic: boolean = true
    ) => {
      if (useMainTopic) topic = `${MqttOptions.mainTopic}${topic}`;
      try {
        if (!msgHandlers[topic]) {
          msgHandlers[topic] = [];
        }
        msgHandlers[topic].push(onMessage);
        console.log(msgHandlers, topic);
        if (client && client.isConnected()) {
          client.subscribe(topic);
          console.log("subscribed", topic);
        }
      } catch (err: any) {
        console.error(err.message);
      }
    };
    // mqtt publish
    const publish = (
      topic: string,
      payload: string,
      mode: MqttMode,
      useMainTopic: boolean = true
    ) => {
      try {
        if (useMainTopic) topic = `${MqttOptions.mainTopic}${topic}`;
        if (client && client.isConnected()) {
          client.send(
            topic,
            payload,
            MQTT_STATE[mode].qos,
            MQTT_STATE[mode].ret
          );
        }
      } catch (err: any) {
        console.error(err.message);
      }
    };

    const onConnectionLost = (responseObject: { errorCode: number }) => {
      //TODO try after 5 seconds, if not try harder, i see a "reconnect" function in the thing maybe that works
      if (responseObject.errorCode !== 0) {
        console.warn(
          `%c mqtt disconnected`,
          "color:red;font-weight:bold;font-size:15px"
        );
        SwalFire({
          title: "Error",
          text: "MQTT connection lost",
          icon: "error",
        });
      }
    };
    const onMessageArrived = (message: {
      payloadString: string;
      destinationName: string;
    }) => {
      const topic = message.destinationName;
      const payload = message.payloadString.replace(/\0.*$/g, "").trim();
      if (msgHandlers[topic]) {
        msgHandlers[topic].forEach((handler) => {
          if (handler) handler(payload);
        });
      } else {
        console.warn("Unhandled topic!", topic, payload);
      }
    };
    // set mqtt client
    const client = new Paho.Client(
      MqttOptions.host,
      MqttOptions.port,
      MqttOptions.clientId
    );
    // set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    // check for auto connect
    if (PluginOptions.autoConnect) connectClient();

    // Global Functions
    app.config.globalProperties.$mqtt = {
      connect: connectClient,
      disconnect: disconnectClient,
      subscribe,
      publish,
    };
  };
};
