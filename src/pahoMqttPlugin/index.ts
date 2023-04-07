import {
  PahoMqttPluginOptions,
  MqttOptions,
  MqttState,
  MqttMode,
  MainOptions,
  MqttInstance,
  MqttStatus,
  MsgHandler,
} from './types';
import { App, ref, reactive } from 'vue';
import type { SweetAlertOptions } from 'sweetalert2';
import Paho, { Client } from 'paho-mqtt';
import swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export const createPahoMqttPlugin = (MainOptions: MainOptions) => {
  return (app: App) => {
    // Options
    let { PluginOptions, MqttOptions } = MainOptions;

    const defaultPluginOptions: PahoMqttPluginOptions = {
      showNotifications: true,
      autoConnect: true,
    };

    const defaultMqttOptions: Partial<MqttOptions> = {
      host: 'localhost',
      port: 9001,
      clientId: `ClientId-${Math.random() * 9999}`,
      mainTopic: 'MAIN',
      enableMainTopic: true,
      watchdogTimeout: 2000,
      reconnectTimeout: 5000,
    };
    PluginOptions = { ...defaultPluginOptions, ...PluginOptions };
    MqttOptions = reactive({ ...defaultMqttOptions, ...MqttOptions });

    const MQTT_STATE: MqttState = {
      B: {
        qos: 0,
        ret: false,
      },
      Br: {
        qos: 0,
        ret: true,
      },
      Q: {
        qos: 1,
        ret: false,
      },
      Qr: {
        qos: 1,
        ret: true,
      },
      F: {
        qos: 2,
        ret: true,
      },
      Fnr: {
        qos: 2,
        ret: false,
      },
    };

    // Message Handlers
    let msgHandlers: MsgHandler = {};
    const clearMsgHandlers = () => {
      msgHandlers = {};
    };

    let queueMsgHandlers: MsgHandler = {};
    const clearQueueMsgHandlers = () => {
      queueMsgHandlers = {};
    };

    const mqttStatus = ref<MqttStatus | string | null>(null);
    const connectWatchdog = ref<NodeJS.Timeout | null>(null);
    const stayConnected = ref<boolean>(false);

    let client: Client = new Paho.Client(
      MqttOptions.host,
      MqttOptions.port,
      MqttOptions.clientId,
    );

    /* Private Functions */
    /**
     * @description - used to show a notification using sweetalert2 package
     * @param {SweetAlertOptions} swalSettings - used to set the settings for the notification
     * @param {boolean} [enable=true] - used to enable or disable the notification (default: true)
     */
    const SweetAlert = (swalSettings: SweetAlertOptions, enable = true) => {
      if (!PluginOptions.showNotifications || !enable) return;
      swal.fire(swalSettings);
    };

    const onFailureCallback = () => {
      mqttStatus.value = 'error';
      console.log('%cmqtt failed to connect', 'color:red');
      SweetAlert({
        title: 'Mqtt Error',
        text: 'MQTT failed to connect',
        icon: 'error',
      });
    };

    const onConnectCallback = () => {
      clearTimeout(connectWatchdog.value as NodeJS.Timeout);
      mqttStatus.value = 'connected';
      stayConnected.value = true;
      console.log('%cmqtt connected', 'color:green');

      for (const topic of Object.keys(queueMsgHandlers)) {
        if (!msgHandlers[topic]) {
          msgHandlers[topic] = [];
        }

        client.subscribe(topic);

        for (const handler of queueMsgHandlers[topic]) {
          msgHandlers[topic].push(handler);
        }
      }

      clearQueueMsgHandlers();

      SweetAlert({
        title: 'Connected',
        text: 'Mqtt Connected',
        icon: 'success',
        timer: 1500,
        timerProgressBar: true,
      });
    };

    /**
     * @description Disconnect from the mqtt broker.
     * Shows a dialog notification in case of error if the plugin is configured to do so.
     */
    const disconnectClient = () => {
      stayConnected.value = false;
      try {
        client.disconnect();
      } catch (err: any) {
        console.error(err);
        mqttStatus.value = 'error';
        SweetAlert({
          title: 'Error',
          text: err.message,
          icon: 'error',
        });
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
      onConnect?: () => unknown;
      onFailure?: () => unknown;
      onConnectionLost?: (responseObject: { errorCode: number }) => unknown;
      onMessageArrived?: (message: {
        payloadString: string;
        destinationName: string;
      }) => unknown;
    } = {}) => {
      mqttStatus.value = 'connecting';
      connectWatchdog.value = setTimeout(() => {
        mqttStatus.value = 'error';
        disconnectClient();
        SweetAlert({
          title: 'Mqtt Error',
          text: 'Broker connection timed out!',
          icon: 'error',
        });
      }, MqttOptions.watchdogTimeout);
      try {
        client = new Paho.Client(
          MqttOptions.host,
          MqttOptions.port,
          MqttOptions.clientId,
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
        mqttStatus.value = 'error';
        SweetAlert({
          title: 'Error',
          text: err.message,
          icon: 'error',
        });
        clearTimeout(connectWatchdog.value as NodeJS.Timeout);
      }
    };

    /**
     * @description used to subscribe to the topic specified
     * @param topic mqtt topic
     * @param onMessage function to be called when a message is received
     * @param useMainTopic if true, MqttOptions.mainTopic will be prepended to the topic (default: true)
     */
    const subscribe = (
      topic: string,
      onMessage: () => unknown,
      useMainTopic = true,
    ) => {
      topic =
        useMainTopic && MqttOptions.enableMainTopic
          ? `${MqttOptions.mainTopic}/${topic}`
          : topic;
      try {
        if (client && client.isConnected()) {
          if (!msgHandlers[topic]) {
            msgHandlers[topic] = [];
          }
          msgHandlers[topic].push(onMessage);
          client.subscribe(topic);
        } else if (client && !client.isConnected()) {
          if (!queueMsgHandlers[topic]) {
            queueMsgHandlers[topic] = [];
          }
          queueMsgHandlers[topic].push(onMessage);
        }
      } catch (err: any) {
        console.error(err.message);
      }
    };

    /**
     * @description used to publish string data to the topic specified
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
      useMainTopic = true,
    ) => {
      try {
        topic =
          useMainTopic && MqttOptions.enableMainTopic
            ? `${MqttOptions.mainTopic}/${topic}`
            : topic;
        if (client && client.isConnected()) {
          client.send(
            topic,
            payload,
            MQTT_STATE[mode].qos,
            MQTT_STATE[mode].ret,
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
      mqttStatus.value = 'disconnected';
      for (const topic of Object.keys(msgHandlers)) {
        if (!queueMsgHandlers[topic]) {
          queueMsgHandlers[topic] = [];
        }

        for (const handler of msgHandlers[topic]) {
          queueMsgHandlers[topic].push(handler);
        }
      }

      clearMsgHandlers();

      if (responseObject.errorCode !== 0) {
        SweetAlert({
          title: 'Error',
          text: 'MQTT connection lost',
          icon: 'error',
        });
      }
      console.log('%cmqtt disconnected', 'color:red;');
      if (stayConnected.value) {
        console.warn('%cmqtt connection lost', 'color:red;');
        setTimeout(() => {
          if (!client || !client.isConnected()) {
            connectClient();
            console.timeEnd('reconnecting...');
          }
        }, MqttOptions.reconnectTimeout);
      }
    };

    const onMessageArrivedCallback = (message: {
      payloadString: string;
      destinationName: string;
    }) => {
      const topic = message.destinationName;
      const payload = message.payloadString.replace(/\0.*$/g, '').trim();
      if (msgHandlers[topic]) {
        msgHandlers[topic].forEach((handler) => {
          if (handler) handler(payload);
        });
      } else {
        console.warn('Unhandled topic!', topic, payload);
      }
    };

    const unsubscribe = (topic: string, useMainTopic = true) => {
      topic =
        useMainTopic && MqttOptions.enableMainTopic
          ? `${MqttOptions.mainTopic}/${topic}`
          : topic;
      if (msgHandlers[topic]) delete msgHandlers[topic];
      if (queueMsgHandlers[topic]) delete queueMsgHandlers[topic];
      if (client && client.isConnected()) {
        client.unsubscribe(topic);
      }
    };

    const unsubscribeAll = () => {
      const subscribedTopics = {
        ...Object.keys(queueMsgHandlers),
        ...Object.keys(msgHandlers),
      };

      for (const i in Object.keys(subscribedTopics)) {
        if (client && client.isConnected()) {
          try {
            client.unsubscribe(subscribedTopics[i]);
          } catch (err: any) {
            console.error(err.message);
          }
        }
      }

      clearMsgHandlers();
      clearQueueMsgHandlers();
    };

    /* Check Auto Connect */
    if (PluginOptions.autoConnect) connectClient();

    const port = (e?: number) => {
      if (e !== undefined) {
        return (MqttOptions.port = e);
      }
      return MqttOptions.port;
    };
    const host = (e?: string) => {
      if (e !== undefined) {
        return (MqttOptions.host = e);
      }
      return MqttOptions.host;
    };
    const clientId = (e?: string) => {
      if (e !== undefined) {
        return (MqttOptions.clientId = e);
      }
      return MqttOptions.clientId;
    };
    const mainTopic = (e?: string) => {
      if (e !== undefined) {
        return (MqttOptions.mainTopic = e);
      }
      return MqttOptions.mainTopic;
    };
    const status = (e?: MqttStatus | string) => {
      if (e !== undefined && e !== null) {
        return (mqttStatus.value = e);
      }
      return mqttStatus.value;
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
      unsubscribe,
      unsubscribeAll,
      status,
    };

    app.config.globalProperties.$mqtt = mqttInstance;
  };
};
