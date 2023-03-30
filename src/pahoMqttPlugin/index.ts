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
    /* Private Functions */
    /**
     * @description - used to show a notification using sweetalert2 package
     * @param {SweetAlertOptions} swalSettings - used to set the settings for the notification
     * @param {boolean} [enable=true] - used to enable or disable the notification (default: true)
     */
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

    /**
     * @description Disconnect from the mqtt broker.
     * Shows a dialog notification in case of error if the plugin is configured to do so.
     */
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
    /**
     * Connect to the mqtt broker
     * Shows a dialog notification in case of error if the plugin is configured to do so.
     */
    const connectClient = () => {
      try {
        client.connect({ onSuccess: onConnect });
      } catch (err: any) {
        console.error(err);
        SwalFire({ title: "Error", text: err.message, icon: "error" });
      }
    };
    /**
     * @description used to subscribe to a topic
     * @param topic mqtt topic
     * @param onMessage function to be called when a message is received
     * @param useMainTopic if true, MqttOptions.mainTopic will be prepended to the topic (default: true)
     */
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
    /**
     * @description used to unsubscribe from a topic
     * @param topic mqtt topic
     * @param payload payload to be sent
     * @param mode  "B" - for best effort (at most once delivery)
     *              "F" - for at least once delivery
     * @param useMainTopic if true, MqttOptions.mainTopic will be prepended to the topic (default: true)
     */
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

    /**
     * @description fires when the mqtt connection is lost
     * @param responseObject contains the error code of the disconnection
     */
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
    /* Mqtt Client */
    const client = new Paho.Client(
      MqttOptions.host,
      MqttOptions.port,
      MqttOptions.clientId
    );
    /* Callback handlers */
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    /* Check Auto Connect */
    if (PluginOptions.autoConnect) connectClient();

    /* Global Functions */
    app.config.globalProperties.$mqtt = {
      connect: connectClient,
      disconnect: disconnectClient,
      subscribe,
      publish,
    };
  };
};
