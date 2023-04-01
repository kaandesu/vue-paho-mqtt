import {
  PahoMqttPluginOptions,
  MqttOptions,
  MqttState,
  MqttMode,
  MainOptions,
  MqttInstance,
  MsgHandler,
} from "./types";
import { App, ref } from "vue";
import type { SweetAlertOptions } from "sweetalert2";
import Paho, { Client } from "paho-mqtt";
import defu from "defu";
import swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import {
  msgHandlers,
  clearMsgHandlers,
  queueMsgHandler,
  clearQueueMsgHandler,
} from "./msgHandlers";

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

    const status = ref<boolean>(false);

    let client: Client = new Paho.Client(
      MqttOptions.host,
      MqttOptions.port,
      MqttOptions.clientId
    );
    /* Private Functions */
    /**
     * @description - used to show a notification using sweetalert2 package
     * @param {SweetAlertOptions} swalSettings - used to set the settings for the notification
     * @param {boolean} [enable=true] - used to enable or disable the notification (default: true)
     */
    const SweetAlert = (
      swalSettings: SweetAlertOptions,
      enable: boolean = true
    ) => {
      if (!PluginOptions.showNotifications || !enable) return;
      swal.fire(swalSettings);
    };
    const onFailureCallback = () => {
      status.value = false;
      console.log(
        `%c mqtt failed to connect`,
        "color:red;font-weight:bold;font-size:15px"
      );
      SweetAlert({
        title: "Mqtt Error",
        text: "MQTT failed to connect",
        icon: "error",
      });
    };
    const onConnectCallback = () => {
      status.value = true;
      console.log(
        `%c mqtt connected`,
        "color:green;font-weight:bold;font-size:15px"
      );

      for (const topic of Object.keys(queueMsgHandler)) {
        if (!msgHandlers[topic]) {
          msgHandlers[topic] = [];
        }

        client.subscribe(topic);

        for (const handler of queueMsgHandler[topic]) {
          msgHandlers[topic].push(handler);
        }
      }

      clearQueueMsgHandler();

      SweetAlert({
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
        SweetAlert({ title: "Error", text: err.message, icon: "error" });
      }
    };

    /**
     * Connect to the mqtt broker
     * Shows a dialog notification in case of error if the plugin is configured to do so.
     */
    const connectClient = ({
      onConnect,
      onFailure,
      onConnectionLost,
      onMessageArrived,
    }: {
      onConnect?: () => any;
      onFailure?: () => any;
      onConnectionLost?: (responseObject: { errorCode: number }) => any;
      onMessageArrived?: (message: {
        payloadString: string;
        destinationName: string;
      }) => any;
    } = {}) => {
      try {
        client = new Paho.Client(
          MqttOptions.host,
          MqttOptions.port,
          MqttOptions.clientId
        );

        client.onConnectionLost = (responseObject: { errorCode: number }) => {
          onConnectionLostCallback(responseObject);
          if (onConnectionLost) onConnectionLost(responseObject);
        };
        client.onMessageArrived = (message: {
          payloadString: string;
          destinationName: string;
        }) => {
          onMessageArrivedCallback(message);
          if (onMessageArrived) onMessageArrived(message);
        };

        client.connect({
          onSuccess: () => {
            onConnectCallback();
            if (onConnect) onConnect();
          },
          onFailure: () => {
            onFailureCallback();
            if (onFailure) onFailure();
          },
        });
      } catch (err: any) {
        console.error(err);
        SweetAlert({ title: "Error", text: err.message, icon: "error" });
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
        if (client && client.isConnected()) {
          if (!msgHandlers[topic]) {
            msgHandlers[topic] = [];
          }
          msgHandlers[topic].push(onMessage);
          client.subscribe(topic);
        } else if (client && !client.isConnected()) {
          if (!queueMsgHandler[topic]) {
            queueMsgHandler[topic] = [];
          }
          queueMsgHandler[topic].push(onMessage);
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
    const onConnectionLostCallback = (responseObject: {
      errorCode: number;
    }) => {
      status.value = false;

      for (const topic of Object.keys(msgHandlers)) {
        if (!queueMsgHandler[topic]) {
          queueMsgHandler[topic] = [];
        }

        for (const handler of msgHandlers[topic]) {
          queueMsgHandler[topic].push(handler);
        }
      }

      clearMsgHandlers();

      //TODO try after 5 seconds, if not try harder, i see a "reconnect" function in the thing maybe that works
      if (responseObject.errorCode !== 0) {
        console.warn(
          `%c mqtt disconnected`,
          "color:red;font-weight:bold;font-size:15px"
        );
        SweetAlert({
          title: "Error",
          text: "MQTT connection lost",
          icon: "error",
        });
      }
    };
    const onMessageArrivedCallback = (message: {
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
    /* Check Auto Connect */
    if (PluginOptions.autoConnect) connectClient();

    const port = (e?: number) => {
      if (e !== undefined) return (MqttOptions.port = e);
      return MqttOptions.port;
    };
    const host = (e?: string) => {
      if (e !== undefined) return (MqttOptions.host = e);
      return MqttOptions.host;
    };
    const clientId = (e?: string) => {
      if (e !== undefined) return (MqttOptions.clientId = e);
      return MqttOptions.clientId;
    };
    const mainTopic = (e?: string) => {
      if (e !== undefined) return (MqttOptions.mainTopic = e);
      return MqttOptions.mainTopic;
    };

    /* Global Functions */
    const mqttInstance: MqttInstance = {
      connect: connectClient,
      disconnect: disconnectClient,
      subscribe,
      publish,
      host,
      port,
      clientId,
      mainTopic,
    };
    const showClient = () => {
      console.log(
        `port: ${client.port}\n host: ${client.host}\n clientId: ${client.clientId}\n mainTopic: ${MqttOptions.mainTopic}`
      );
    };
    // make mqttInstance a global variable
    app.config.globalProperties.$mqtt = mqttInstance;
    app.config.globalProperties.$status = status;
    app.config.globalProperties.$showClient = showClient;
  };
};
